import {
	Arg,
	Ctx,
	Field,
	InputType,
	Int,
	Mutation,
	Resolver,
	UseMiddleware,
} from 'type-graphql';
import { Game, GameStatus } from '../../entities/Game';
import { GameUser } from '../../entities/GameUser';
import { isAuth } from '../../middlware/isAuth';
import { Context } from '../../types';

@InputType()
export class JoinGameInput {
	@Field(() => Int)
	id: number;
}

@Resolver(Game)
export class JoinGameResolver {
	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async joinGame(
		@Arg('input') { id }: JoinGameInput,
		@Ctx() { req }: Context
	): Promise<Boolean> {
		const userId = req.session.userId!;

		const game = await Game.findOne(id);
		if (!game) throw new Error('Game not Found');
		if (game.status != GameStatus.Open) throw new Error('Game not Open');

		const gameUser = await GameUser.findOne({ where: { gameId: id, userId } });
		if (gameUser) throw new Error('User Already Joined');

		await GameUser.create({
			userId,
			gameId: id,
		}).save();

		return true;
	}
}
