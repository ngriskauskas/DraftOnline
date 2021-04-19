import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { v4 } from 'uuid';
import { FORGET_PASSWORD_PREFIX } from '../../config/constants';
import { User } from '../../entities/User';
import { Context } from '../../types';
import { sendEmail } from '../../utils/sendEmail';

@Resolver(User)
export class ForgotPasswordResolver {
	@Mutation(() => Boolean)
	async forgotPassword(
		@Arg('email') email: string,
		@Ctx() { redis }: Context
	): Promise<Boolean> {
		const user = await User.findOne({
			where: { email },
		});
		if (!user) {
			return true;
		}
		const token = v4();

		await redis.set(
			FORGET_PASSWORD_PREFIX + token,
			user.id,
			'ex',
			1000 * 60 * 60
		);
		await sendEmail(
			email,
			`<a href="http://localhost:3000/change-password/${token}">Reset Password</a>`
		);
		return true;
	}
}
