import { Context } from 'node:vm';
import { Ctx, Query, Resolver } from 'type-graphql';
import { User } from '../../entities/User';

@Resolver(User)
export class MeResolver {
	@Query(() => User, { nullable: true })
	me(@Ctx() { req }: Context) {
		if (!req.session.userId) {
			return null;
		}
		return User.findOne(req.session.userId, { relations: ['upvotes'] });
	}
}
