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
	@Field()
	@Min(-1)
	@Max(1)
	@IsInt()
	value: number;

	@Field()
	postId: number;
}

@Resolver(Post)
export class PostResolver {
	@FieldResolver(() => String)
	textSnippet(@Root() root: Post) {
		return root.text.slice(0, 100) + ' ...';
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
			where: cursor
				? { createdAt: LessThan(new Date(parseInt(cursor))) }
				: {},
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
	async createPost(
		@Arg('input') { title, text }: PostInput,
		@Ctx() { req }: MyContext
	): Promise<Post> {
		return Post.create({
			title,
			text,
			authorId: req.session.userId,
		}).save();
	}

	@Mutation(() => Post, { nullable: true })
	async updatePost(
		@Arg('id') id: number,
		@Arg('input') { title }: PostInput
	): Promise<Post> {
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
		const { userId } = req.session;
		Upvote.insert({ userId, postId: input.postId, value: input.value });
		return true;
	}
}
