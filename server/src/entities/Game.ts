import { ObjectType, Field, Int } from 'type-graphql';
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
import { User } from './User';

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

	@Field(() => User)
	@ManyToOne(() => User, (user) => user.createdGames, { onDelete: 'CASCADE' })
	creator: User;

	@Column()
	creatorId: number;

	@OneToMany(() => GameUser, (gameUser) => gameUser.game)
	gameUsers: GameUser[];
}
