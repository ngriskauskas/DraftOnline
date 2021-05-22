import {
	Arg,
	Field,
	InputType,
	Int,
	Query,
	Resolver,
	UseMiddleware,
} from 'type-graphql';
import { Game } from '../../entities/Game';
import { Player } from '../../entities/Player';
import { isAuth } from '../../middlware/isAuth';

@InputType()
export class PlayerInput {
	@Field(() => Int)
	gameId: number;
}

@Resolver(Player)
export class PlayersResolver {
	@Query(() => [Player])
	@UseMiddleware(isAuth)
	async players(@Arg('input') { gameId }: PlayerInput): Promise<Player[]> {
		const game = await Game.findOne(gameId);
		if (!game) throw new Error('Game not Found');
		return Player.find({
			where: { game: { id: gameId } },
			relations: ['game'],
		});
	}
}
