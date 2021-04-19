import { hash } from 'argon2';
import { Length, IsEmail } from 'class-validator';
import { Mutation, Arg, Ctx, Resolver, InputType, Field } from 'type-graphql';
import { User } from '../../entities/User';
import { Context } from '../../types';

@InputType()
export class UserRegisterInput {
	@Field()
	@Length(4)
	username: string;

	@Field()
	@IsEmail()
	email: string;

	@Field()
	@Length(4)
	password: string;
}

@Resolver(User)
export class RegisterResolver {
	@Mutation(() => User)
	async register(
		@Arg('input') input: UserRegisterInput,
		@Ctx() { req }: Context
	): Promise<User> {
		try {
			const user = await User.create({
				username: input.username,
				email: input.email,
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
}
