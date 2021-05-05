import { Post } from '../entities/Post';
import {
	Query,
	Resolver,
	Arg,
	Mutation,
	InputType,
	Field,
	Ctx,
	UseMiddleware,
	Int,
	FieldResolver,
	Root,
} from 'type-graphql';
import { Context } from '../types';
import { isAuth } from '../middlware/isAuth';
import { IsInt, Length, Max, Min } from 'class-validator';
import { LessThan } from 'typeorm';
import { Upvote } from '../entities/Upvote';
import { User } from '../entities/User';

@InputType()
class PostInput {
	@Field()
	@Length(3)
	title: string;

	@Field()
	@Length(5)
	text: string;
}

@InputType()
class UpvoteInput {
	@Field(() => Int)
	@Min(-1)
	@Max(1)
	@IsInt()
	value: number;

	@Field(() => Int)
	postId: number;
}

@Resolver(Post)
export class PostResolver {
	@FieldResolver(() => String)
	textSnippet(@Root() { text }: Post) {
		return text.slice(0, 100) + ' ...';
	}
	//Don't do this in the future, join tables should probably not be exposed like this
	@FieldResolver(() => Upvote, { nullable: true })
	async upvote(@Root() { id }: Post, @Ctx() { req }: Context) {
		const { userId } = req.session;
		return Upvote.findOne({ where: { postId: id, userId } });
	}

	@FieldResolver(() => User)
	async author(@Root() post: Post, @Ctx() { userLoader }: Context) {
		return userLoader.load(post.authorId);
	}

	@Query(() => [Post])
	async posts(
		@Arg('limit', () => Int) limit: number,
		@Arg('cursor', () => String, {
			nullable: true,
		})
		cursor: string | null
	): Promise<Post[]> {
		return Post.find({
			where: cursor ? { createdAt: LessThan(new Date(parseInt(cursor))) } : {},
			order: { createdAt: 'DESC' },
			take: Math.min(limit, 50),
		});
	}

	@Query(() => Post, { nullable: true })
	async post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
		return Post.findOne(id);
	}

	@Mutation(() => Post)
	@UseMiddleware(isAuth)
	async createPost(
		@Arg('input') { title, text }: PostInput,
		@Ctx() { req }: Context
	): Promise<Post> {
		return Post.create({
			title,
			text,
			authorId: req.session.userId,
		}).save();
	}

	@Mutation(() => Post, { nullable: true })
	async updatePost(
		@Arg('id', () => Int) id: number,
		@Arg('input') { title }: PostInput
	): Promise<Post> {
		const post = await Post.findOneOrFail(id);
		if (title) {
			await Post.update({ id }, { title });
		}
		return post;
	}

	@Mutation(() => Boolean, { nullable: true })
	@UseMiddleware(isAuth)
	async deletePost(
		@Arg('id', () => Int) id: number,
		@Ctx() { req }: Context
	): Promise<boolean> {
		await Post.delete({ id, authorId: req.session.userId });
		return true;
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async vote(@Arg('input') input: UpvoteInput, @Ctx() { req }: Context) {
		const userId = req.session.userId as number;
		let upvote;
		upvote = await Upvote.findOne({
			where: { userId, postId: input.postId },
		});

		const post = await Post.findOneOrFail(input.postId);

		if (!upvote) {
			upvote = new Upvote();
			upvote.postId = input.postId;
			upvote.userId = userId;
			upvote.value = input.value;
			post.points += input.value;
			upvote.save();
			post.save();
		} else if (upvote.value !== input.value) {
			post.points -= upvote.value;
			post.points += input.value;
			upvote.value = input.value;
			upvote.save();
			post.save();
		}
		return true;
	}
}
