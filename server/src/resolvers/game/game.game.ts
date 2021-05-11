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
import { GameUser } from '../../entities/GameUser';
import { Context } from '../../types';

@Resolver(Game)
export class GameResolver {
	@FieldResolver()
	async creator(@Root() game: Game, @Ctx() { userLoader }: Context) {
		return userLoader.load(game.creatorId);
	}

	@FieldResolver(() => GameUser, { nullable: true })
	async meGameUser(
		@Root() game: Game,
		@Ctx() { req, gameUserLoader }: Context
	) {
		const gameUsers = await gameUserLoader.load(game.id);
		return gameUsers.find((gameUser) => gameUser.userId === req.session.userId);
	}

	@Query(() => Game, { nullable: true })
	async game(@Arg('id', () => Int) id: number): Promise<Game | undefined> {
		return Game.findOne(id);
	}
}
