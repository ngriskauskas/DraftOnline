import { ObjectType, Field, Int, registerEnumType } from 'type-graphql';
import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Column,
	ManyToOne,
} from 'typeorm';
import { Game } from './Game';

export enum TeamName {
	Eagles = 'Eagles',
	Redskins = 'Redskins',
	Giants = 'Giants',
	Colts = 'Colts',
	Steelers = 'Steelers',
	Bears = 'Bears',
	Rams = 'Rams',
	Cardinals = 'Cardinals',
	Packers = 'Packers',
	Lions = 'Lions',
}

registerEnumType(TeamName, {
	name: 'TeamName',
});

@ObjectType()
@Entity()
export class Team extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id!: number;

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date;

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date;

	@Field(() => TeamName)
	@Column({
		type: 'enum',
		enum: TeamName,
	})
	name!: TeamName;

	@Column()
	gameId: number;

	@ManyToOne(() => Game, (game) => game.teams, { onDelete: 'CASCADE' })
	game: Game;
}
