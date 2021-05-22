import { ObjectType, Field, Int } from 'type-graphql';
import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Column,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { Game } from './Game';
import { Position } from './Position';
import { Team } from './Team';

@ObjectType()
@Entity()
export class Player extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id!: number;

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date;

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date;

	@Field(() => Position)
	@Column({
		type: 'enum',
		enum: Position,
	})
	position: Position;

	@Column({ type: 'int' })
	rookieRating: number;

	@Column({ type: 'int' })
	veteranRating: number;

	@JoinColumn()
	@ManyToOne(() => Game)
	game: Game;

	@ManyToOne(() => Team, (team) => team.players, { nullable: true })
	team: Team;

	//injuries
	//retirement
	// age / experience
}
