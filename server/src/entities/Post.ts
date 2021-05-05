import { ObjectType, Field, Int } from 'type-graphql';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Upvote } from './Upvote';
import { User } from './User';

@ObjectType()
@Entity()
export class Post extends BaseEntity {
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

	@Field()
	@Column()
	text!: string;

	@Field(() => User)
	@ManyToOne(() => User, (user) => user.posts)
	author: User;

	@Column()
	authorId: number;

	@OneToMany(() => Upvote, (upvote) => upvote.post)
	upvotes: Upvote[];

	@Field(() => Int)
	@Column({ default: 0 })
	points: number;
}
