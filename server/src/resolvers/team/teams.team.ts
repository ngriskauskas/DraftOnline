import {
	Arg,
	Field,
	FieldResolver,
	InputType,
	Int,
	Query,
	Resolver,
	Root,
} from 'type-graphql';
import { Team } from '../../entities/Team';
import { User } from '../../entities/User';

@InputType()
export class TeamsInput {
	@Field(() => Int)
	gameId: number;
}

@Resolver(Team)
export class TeamsResolver {
	@FieldResolver(() => User, { nullable: true })
	async manager(@Root() team: Team) {
		return team.manager?.user;
	}

	@Query(() => [Team])
	async teams(@Arg('input') { gameId }: TeamsInput): Promise<Team[]> {
		return Team.find({
			where: { game: { id: gameId } },
			relations: ['manager'],
		});
	}
}
