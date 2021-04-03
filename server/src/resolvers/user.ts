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
	async me(@Ctx() { em, req }: MyContext): Promise<User> {
		if (!req.session.userId) {
			throw Error('Not Logged In');
		}
		return await em.findOneOrFail(User, { id: req.session.userId });
	}

	@Mutation(() => User)
	async register(
		@Arg('options') options: UsernamePasswordInput,
		@Ctx() { em }: MyContext
	): Promise<User> {
		try {
			const user = em.create(User, {
				username: options.username,
				password: await hash(options.password),
			});
			await em.persistAndFlush(user);
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
		@Ctx() { em, req }: MyContext
	): Promise<User> {
		const user = await em.findOneOrFail(User, {
			username: options.username,
		});
		if (!(await verify(user.password, options.password)))
			throw Error('Bad Password');

		req.session.userId = user.id;
		return user;
	}
}
