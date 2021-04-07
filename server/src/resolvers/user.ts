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
import { Length } from 'class-validator';

@InputType()
export class UserInput {
	@Field()
	@Length(4, 16)
	username: string;
	@Field()
	@Length(4)
	password: string;
}

@Resolver()
export class UserResolver {
	@Query(() => User)
	async me(@Ctx() { req }: MyContext): Promise<User> {
		if (!req.session.userId) {
			throw new Error('Not Logged In');
		}
		return await User.findOneOrFail(req.session.userId);
	}

	@Mutation(() => User)
	async register(
		@Arg('input') input: UserInput,
		@Ctx() { req }: MyContext
	): Promise<User> {
		try {
			const user = await User.create({
				username: input.username,
				password: await hash(input.password),
			}).save();
			req.session.userId = user.id;
			return user;
		} catch (err) {
			if (err.message.includes('duplicate')) {
				throw new Error('User Already Exists');
			} else throw err;
		}
	}

	@Mutation(() => User)
	async login(
		@Arg('input') input: UserInput,
		@Ctx() { req }: MyContext
	): Promise<User> {
		const user = await User.findOne({
			where: { username: input.username },
		});
		if (!user) {
			throw new Error('Incorrect Username or Password');
		}
		if (!(await verify(user.password, input.password)))
			throw new Error('Incorrect Username or Password');

		req.session.userId = user.id;
		return user;
	}
}
