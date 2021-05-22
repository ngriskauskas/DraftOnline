import { ObjectType, Field, Int, registerEnumType } from 'type-graphql';
import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	Column,
	ManyToOne,
	OneToOne,
	JoinColumn,
	OneToMany,
} from 'typeorm';
import { Game } from './Game';
import { Manager } from './Manager';
import { Player } from './Player';

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

	@ManyToOne(() => Game, (game) => game.teams, { onDelete: 'CASCADE' })
	game: Game;

	@JoinColumn()
	@OneToOne(() => Manager, (manager) => manager.team, {
		nullable: true,
		cascade: true,
	})
	manager: Manager;

	@JoinColumn()
	@OneToMany(() => Player, (player) => player.team, {
		cascade: ['insert'],
	})
	players: Player[];
}
