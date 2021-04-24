import { verify } from 'argon2';
import { IsEmail, Length } from 'class-validator';
import { Mutation, Arg, Ctx, Resolver, InputType, Field } from 'type-graphql';
import { User } from '../../entities/User';
import { Context } from '../../types';

@InputType()
export class UserLoginInput {
	@Field()
	@IsEmail()
	email: string;

	@Field()
	@Length(4)
	password: string;
}

@Resolver(User)
export class LoginResolver {
	@Mutation(() => User)
	async login(
		@Arg('input') input: UserLoginInput,
		@Ctx() { req }: Context
	): Promise<User> {
		const user = await User.findOne({
			where: { email: input.email },
		});
		if (!user) {
			throw new Error('Incorrect Email or Password');
		} else if (!(await verify(user.password, input.password))) {
			throw new Error('Incorrect Email or Password');
		} else {
			req.session.userId = user.id;
			return user;
		}
	}
}
