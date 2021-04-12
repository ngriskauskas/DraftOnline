import path from 'path';
import { ConnectionOptions } from 'typeorm';
import { __dbPassword__ } from './constants';

const config: ConnectionOptions = {
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: __dbPassword__,
	database: 'draft-online',
	logging: false,
	synchronize: true,
	entities: ['./dist/entities/*.js'],
	migrations: [path.join(__dirname, './migrations/*')],
};

export default config;
