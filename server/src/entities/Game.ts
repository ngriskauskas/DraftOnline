import { ObjectType, Field, Int, registerEnumType } from 'type-graphql';
import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Column,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { GameUser } from './GameUser';
import { Team } from './Team';
import { User } from './User';

export enum GameStatus {
	Open = 'open',
	Active = 'active',
	Complete = 'completed',
}

registerEnumType(GameStatus, {
	name: 'GameStatus',
});

@ObjectType()
@Entity()
export class Game extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id!: number;

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date;

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date;

	@Field()
	@Column()
	title!: string;

	@Field(() => GameStatus)
	@Column({
		type: 'enum',
		enum: GameStatus,
		default: GameStatus.Open,
	})
	status: GameStatus;

	@Column()
	creatorId: number;

	@Field(() => User)
	@ManyToOne(() => User, (user) => user.createdGames, { onDelete: 'CASCADE' })
	creator: User;

	@OneToMany(() => GameUser, (gameUser) => gameUser.user)
	gameUsers: GameUser[];

	@OneToMany(() => Team, (team) => team.game)
	teams: Team[];
}
