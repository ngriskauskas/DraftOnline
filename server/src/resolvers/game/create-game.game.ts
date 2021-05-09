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
import { Game } from '../../entities/Game';
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
		return Game.create({
			title,
			creatorId: req.session.userId,
		}).save();
	}
}
