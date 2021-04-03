import { User } from '../entities/User';
import { MyContext } from '../types';
import {
	Arg,
	Ctx,
	Field,
	InputType,
	Mutation,
	Query,
	Resolver,
} from 'type-graphql';
import { hash, verify } from 'argon2';

@InputType()
class UsernamePasswordInput {
	@Field()
	username: string;
	@Field()
	password: string;
}

@Resolver()
export class UserResolver {
	@Query(() => User)
	async me(@Ctx() { req }: MyContext): Promise<User> {
		if (!req.session.userId) {
			throw Error('Not Logged In');
		}
		return await User.findOneOrFail(req.session.userId);
	}

	@Mutation(() => User)
	async register(
		@Arg('options') options: UsernamePasswordInput
	): Promise<User> {
		try {
			const user = User.create({
				username: options.username,
				password: await hash(options.password),
			}).save();

			return user;
		} catch (err) {
			switch (err.name) {
				case 'UniqueConstraintViolationException':
					throw new Error('Username already exists');
				default:
					throw err;
			}
		}
	}

	@Mutation(() => User)
	async login(
		@Arg('options') options: UsernamePasswordInput,
		@Ctx() { req }: MyContext
	): Promise<User> {
		const user = await User.findOneOrFail({
			where: { username: options.username },
		});
		if (!(await verify(user.password, options.password)))
			throw Error('Bad Password');

		req.session.userId = user.id;
		return user;
	}
}
