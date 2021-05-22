import { Arg, Query, Resolver } from 'type-graphql';
import { LessThan } from 'typeorm';
import { Game } from '../../entities/Game';
import { PaginationInput } from '../common/PaginationInput';

@Resolver(Game)
export class GamesResolver {
	@Query(() => [Game])
	async games(
		@Arg('input') { limit, cursor }: PaginationInput
	): Promise<Game[]> {
		return Game.find({
			where: cursor ? { createdAt: LessThan(new Date(parseInt(cursor))) } : {},
			order: { createdAt: 'DESC' },
			take: limit,
			relations: ['creator'],
		});
	}
}
