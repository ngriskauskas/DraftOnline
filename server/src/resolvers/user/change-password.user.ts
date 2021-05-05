import { hash } from 'argon2';
import { Length } from 'class-validator';
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql';
import { FORGET_PASSWORD_PREFIX } from '../../config/constants';
import { User } from '../../entities/User';
import { Context } from '../../types';

@InputType()
export class ChangePasswordInput {
	@Field()
	token: string;

	@Field()
	@Length(4)
	password: string;
}

@Resolver(User)
export class ChangePasswordResolver {
	@Mutation(() => User)
	async changePassword(
		@Arg('input') input: ChangePasswordInput,
		@Ctx() { redis, req }: Context
	): Promise<User> {
		const userId = await redis.get(FORGET_PASSWORD_PREFIX + input.token);
		if (!userId) {
			throw new Error('Change Password Token Expired');
		}
		await User.update(userId, { password: await hash(input.password) });
		const user = await User.findOneOrFail(userId);
		redis.del(FORGET_PASSWORD_PREFIX + input.token);
		req.session.userId = user.id;
		return user;
	}
}
