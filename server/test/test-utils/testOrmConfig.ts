import ormConfig from '../../src/config/ormconfig';
import { ConnectionOptions } from 'typeorm';
import { Game } from '../../src/entities/Game';
import { Manager } from '../../src/entities/Manager';
import { User } from '../../src/entities/User';
import { Team } from '../../src/entities/Team';

export const testOrmConfig: ConnectionOptions = {
	...ormConfig,
	type: 'postgres',
	database: 'draft-online-test',
	synchronize: true,
	dropSchema: true,
	logging: false,
	entities: [User, Game, Manager, Team],
};
