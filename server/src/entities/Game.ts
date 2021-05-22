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
	JoinColumn,
} from 'typeorm';
import { Manager } from './Manager';
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

	@Field(() => User)
	@ManyToOne(() => User, (user) => user.createdGames, { onDelete: 'CASCADE' })
	creator: User;

	//Rethink, maybe go through teams
	@JoinColumn()
	@OneToMany(() => Manager, (manager) => manager.game, { cascade: true })
	managers: Manager[];

	@JoinColumn()
	@OneToMany(() => Team, (team) => team.game, { cascade: true })
	teams: Team[];
}
