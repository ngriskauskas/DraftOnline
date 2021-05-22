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
import { User } from '../../entities/User';
import { isAuth } from '../../middlware/isAuth';
import { Context } from '../../types';
import seedTeams from '../../data/teams';
import { Team } from '../../entities/Team';

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
			creator: await User.findOneOrFail(req.session.userId),
		}).save();

		game.teams = seedTeams(game)
			.slice(0, NUMTEAMS)
			.map(({ name, players }) => Team.create({ name, players }));
		await game.save();
		return game;
	}
}
