import { ObjectType, Field } from 'type-graphql';
import { Entity, BaseEntity, PrimaryColumn, ManyToOne } from 'typeorm';
import { Game } from './Game';
import { User } from './User';

@ObjectType()
@Entity()
export class GameUser extends BaseEntity {
	@Field()
	@PrimaryColumn()
	userId: number;

	@Field(() => User)
	@ManyToOne(() => User, (user) => user.joinedGames)
	user: User;

	@Field()
	@PrimaryColumn()
	gameId: number;

	@Field(() => Game)
	@ManyToOne(() => Game, (game) => game.gameUsers, { onDelete: 'CASCADE' })
	game: Game;
}
