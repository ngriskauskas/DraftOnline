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
import { Manager } from '../../entities/Manager';
import { Team } from '../../entities/Team';
import { User } from '../../entities/User';
import { isAuth } from '../../middlware/isAuth';
import { Context } from '../../types';

@InputType()
export class JoinGameInput {
	@Field(() => Int)
	id: number;

	@Field(() => Int)
	teamId: number;
}

@Resolver(Game)
export class JoinGameResolver {
	@Mutation(() => Boolean)
	@UseMiddleware(isAuth)
	async joinGame(
		@Arg('input') { id, teamId }: JoinGameInput,
		@Ctx() { req }: Context
	): Promise<Boolean> {
		const userId = req.session.userId!;

		const game = await Game.findOne(id);
		if (!game) throw new Error('Game not Found');
		if (game.status != GameStatus.Open) throw new Error('Game not Open');

		const manager = await Manager.findOne({
			where: { game: { id }, user: { id: userId } },
		});
		if (manager) throw new Error('User Already Joined');

		const team = await Team.findOne(teamId, { relations: ['manager'] });
		if (!team) throw new Error('Team not Found');
		if (team.manager) throw new Error('Team already Taken');

		team.manager = Manager.create({
			user: await User.findOneOrFail(userId),
			game,
		});
		await team.save();
		return true;
	}
}
