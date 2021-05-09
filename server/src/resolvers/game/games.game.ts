import { Arg, FieldResolver, Int, Query, Resolver, Root } from 'type-graphql';
import { LessThan } from 'typeorm';
import { Game } from '../../entities/Game';
import { User } from '../../entities/User';
import { PaginationInput } from '../common/PaginationInput';

@Resolver(Game)
export class GamesResolver {
	@FieldResolver()
	async creator(@Root() game: Game) {
		return User.findOneOrFail(game.creatorId);
	}

	@Query(() => Game, { nullable: true })
	async game(@Arg('id', () => Int) id: number): Promise<Game | undefined> {
		return Game.findOne(id);
	}

	@Query(() => [Game])
	async games(
		@Arg('input') { limit, cursor }: PaginationInput
	): Promise<Game[]> {
		return Game.find({
			where: cursor ? { createdAt: LessThan(new Date(parseInt(cursor))) } : {},
			order: { createdAt: 'DESC' },
			take: limit,
		});
	}
}
