import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Game } from './Game';
import { User } from './User';

@ObjectType()
@Entity()
export class GameUser extends BaseEntity {
	@Field()
	@PrimaryColumn()
	userId: number;

	@Field(() => User)
	@ManyToOne(() => User, (user) => user.joinedGames, { onDelete: 'CASCADE' })
	user: User;

	@Field()
	@PrimaryColumn()
	gameId: number;

	@ManyToOne(() => Game, (game) => game.gameUsers, { onDelete: 'CASCADE' })
	game: Game;
}
