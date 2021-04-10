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
} from 'type-graphql';
import { MyContext } from '../types';
import { isAuth } from '../middlware/isAuth';
import { Length } from 'class-validator';

@InputType()
class PostInput {
	@Field()
	@Length(3)
	title: string;

	@Field()
	@Length(5)
	text: string;
}

@Resolver()
export class PostResolver {
	@Query(() => [Post])
	posts(): Promise<Post[]> {
		return Post.find();
	}

	@Query(() => Post, { nullable: true })
	post(@Arg('id') id: number): Promise<Post | undefined> {
		return Post.findOne(id);
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
}
