import {
	BaseEntity,
	Entity,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './Game';
import { Team } from './Team';
import { User } from './User';

@Entity()
export class Manager extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.managers, {
		onDelete: 'CASCADE',
		eager: true,
	})
	user: User;

	@ManyToOne(() => Game, (game) => game.managers, {
		onDelete: 'CASCADE',
		eager: true,
	})
	game: Game;

	@OneToOne(() => Team, (team) => team.manager)
	team: Team;
}
