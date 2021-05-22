import {
	FieldResolver,
	Root,
	Ctx,
	Query,
	Arg,
	Int,
	Resolver,
} from 'type-graphql';
import { Game } from '../../entities/Game';
import { Context } from '../../types';

@Resolver(Game)
export class GameResolver {
	@FieldResolver(() => Boolean)
	async meJoined(@Root() game: Game, @Ctx() { req, userLoader }: Context) {
		if (!req.session.userId) return false;
		const user = await userLoader.load(req.session.userId);
		return user.managers.some((manager) => manager.game.id === game.id);
	}

	@Query(() => Game, { nullable: true })
	async game(@Arg('id', () => Int) id: number): Promise<Game | undefined> {
		return Game.findOne(id, { relations: ['creator'] });
	}
}
