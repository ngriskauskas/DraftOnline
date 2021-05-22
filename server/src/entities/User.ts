import { Field, ObjectType } from 'type-graphql';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Game } from './Game';
import { Manager } from './Manager';

@ObjectType()
@Entity()
export class User extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id!: number;

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date;

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date;

	@Field(() => String)
	@Column({ unique: true })
	username!: string;

	@Field(() => String)
	@Column({ unique: true })
	email!: string;

	@Column()
	password!: string;

	@JoinColumn()
	@OneToMany(() => Game, (game) => game.creator)
	createdGames: Game[];

	@JoinColumn()
	@OneToMany(() => Manager, (manager) => manager.user)
	managers: Manager[];
}
