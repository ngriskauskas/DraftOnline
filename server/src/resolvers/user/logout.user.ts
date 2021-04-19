import { Ctx, Mutation, Resolver } from 'type-graphql';
import { COOKIE_NAME } from '../../config/constants';
import { User } from '../../entities/User';
import { Context } from '../../types';

@Resolver(User)
export class LogoutResolver {
	@Mutation(() => Boolean)
	async logout(@Ctx() { req, res }: Context): Promise<Boolean> {
		return new Promise((resolve) =>
			req.session.destroy((err) => {
				if (err) resolve(false);
				else {
					res.clearCookie(COOKIE_NAME);
					resolve(true);
				}
			})
		);
	}
}
