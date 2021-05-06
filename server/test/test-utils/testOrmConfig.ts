import { ConnectionOptions } from 'typeorm';
import ormConfig from '../../src/config/ormconfig';
import { Game } from '../../src/entities/Game';
import { GameUser } from '../../src/entities/GameUser';
import { User } from '../../src/entities/User';

export const testOrmConfig: ConnectionOptions = {
	...ormConfig,
	type: 'postgres',
	database: 'draft-online-test',
	synchronize: true,
	dropSchema: true,
	logging: false,
	entities: [User, Game, GameUser],
};
