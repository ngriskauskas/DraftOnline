import { ConnectionOptions, createConnection } from 'typeorm';
import { Post } from '../../src/entities/Post';
import { User } from '../../src/entities/User';
import config from '../../src/ormconfig';

export const testConn = (drop: boolean = false) => {
	const testConfig: ConnectionOptions = {
		...config,
		type: 'postgres',
		database: 'draft-online-test',
		synchronize: drop,
		dropSchema: drop,
		logging: false,
		entities: [Post, User],
	};
	return createConnection(testConfig);
};
