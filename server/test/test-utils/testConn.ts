import { ConnectionOptions } from 'typeorm';
import ormConfig from '../../src/config/ormconfig';
import { Post } from '../../src/entities/Post';
import { Upvote } from '../../src/entities/Upvote';
import { User } from '../../src/entities/User';

export const testOrmConfig: ConnectionOptions = {
	...ormConfig,
	type: 'postgres',
	database: 'draft-online-test',
	synchronize: true,
	dropSchema: true,
	logging: false,
	entities: [Post, User, Upvote],
};
