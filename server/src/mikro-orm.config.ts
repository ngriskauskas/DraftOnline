import { __prod__ } from './constants';
import { Post } from './entities/Post';
import { Options } from '@mikro-orm/core';

const config: Options = {
	entities: [Post],
	dbName: 'draft-online',
	type: 'postgresql',
	debug: !__prod__,
};

export default config;
