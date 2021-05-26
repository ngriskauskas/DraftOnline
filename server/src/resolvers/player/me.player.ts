import {
	Arg,
	Ctx,
	Field,
	InputType,
	Int,
	Query,
	Resolver,
	UseMiddleware,
} from 'type-graphql';
import { Game } from '../../entities/Game';
import { Manager } from '../../entities/Manager';
import { Player } from '../../entities/Player';
import { isAuth } from '../../middlware/isAuth';
import { Context } from '../../types';

@InputType()
export class MePlayerInput {
	@Field(() => Int)
	gameId: number;
}

@Resolver(Player)
export class MePlayersResolver {
	@Query(() => [Player])
	@UseMiddleware(isAuth)
	async mePlayers(
		@Arg('input') { gameId }: MePlayerInput,
		@Ctx() { req }: Context
	): Promise<Player[]> {
		const game = await Game.findOne(gameId);
		if (!game) throw new Error('Game not Found');

		const manager = await Manager.findOne({
			where: { game: { id: gameId }, user: { id: req.session.userId } },
			relations: ['game', 'user', 'team'],
		});
		if (!manager) throw new Error('User not Joined');

		return Player.find({
			where: { game: { id: gameId }, team: { id: manager.team.id } },
			relations: ['game', 'team'],
		});
	}
}
