import { Length } from 'class-validator';
import {
	Arg,
	Ctx,
	Field,
	InputType,
	Mutation,
	Resolver,
	UseMiddleware,
} from 'type-graphql';
import { NUMTEAMS } from '../../config/constants';
import { Game } from '../../entities/Game';
import { Team, TeamName } from '../../entities/Team';
import { isAuth } from '../../middlware/isAuth';
import { Context } from '../../types';

@InputType()
class CreateGameInput {
	@Field()
	@Length(4)
	title: string;
}

@Resolver(Game)
export class CreateGameResolver {
	@Mutation(() => Game)
	@UseMiddleware(isAuth)
	async createGame(
		@Arg('input') { title }: CreateGameInput,
		@Ctx() { req }: Context
	): Promise<Game> {
		const game = await Game.create({
			title,
			creatorId: req.session.userId,
		}).save();

		Array(NUMTEAMS)
			.fill(0)
			.forEach(async (_, i) => {
				await Team.create({
					gameId: game.id,
					name: TeamName[Object.values(TeamName)[i]],
				}).save();
			});

		return game;
	}
}
