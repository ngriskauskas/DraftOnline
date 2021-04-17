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
import { MyContext } from '../types';
import { isAuth } from '../middlware/isAuth';
import { IsInt, Length, Max, Min } from 'class-validator';
import { LessThan } from 'typeorm';
import { Upvote } from '../entities/Upvote';

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
	textSnippet(@Root() root: Post) {
		return root.text.slice(0, 100) + ' ...';
	}

	@FieldResolver(() => Upvote, { nullable: true })
	async upvote(@Root() { id }: Post, @Ctx() { req }: MyContext) {
		const { userId } = req.session;
		return Upvote.findOne({ where: { postId: id, userId } });
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
			relations: ['author', 'upvotes'],
			where: cursor ? { createdAt: LessThan(new Date(parseInt(cursor))) } : {},
			order: { createdAt: 'DESC' },
			take: Math.min(limit, 50),
		});
	}

	@Query(() => Post, { nullable: true })
	async post(@Arg('id') id: number): Promise<Post | undefined> {
		return Post.findOne(id, {
			relations: ['author', 'upvotes'],
		});
	}

	@Mutation(() => Post)
	@UseMiddleware(isAuth)
	async createPost(@Arg('input') { title, text }: PostInput, @Ctx() { req }: MyContext): Promise<Post> {
		return Post.create({
			title,
			text,
			authorId: req.session.userId,
		}).save();
	}

	@Mutation(() => Post, { nullable: true })
	async updatePost(@Arg('id') id: number, @Arg('input') { title }: PostInput): Promise<Post> {
		const post = await Post.findOneOrFail(id);
		if (title) {
			await Post.update({ id }, { title });
		}
		return post;
	}

	@Mutation(() => Post, { nullable: true })
	async deletePost(@Arg('id') id: number): Promise<boolean> {
		await Post.delete(id);
		return true;
	}

	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async vote(@Arg('input') input: UpvoteInput, @Ctx() { req }: MyContext) {
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
