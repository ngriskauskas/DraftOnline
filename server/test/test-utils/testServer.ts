import Redis from 'ioredis';
import { Connection, createConnection } from 'typeorm';
import { createApp } from '../../src/config/server';
import { testOrmConfig } from './testOrmConfig';

let conn: Connection;
let redis: Redis.Redis;
export const initTestServer = async () => {
	jest.setTimeout(60000);
	try {
		conn = await createConnection(testOrmConfig);
	} catch (err) {
		console.log(err);
	}
	redis = new Redis();
	return await createApp(conn, redis);
};

export const closeTestServer = async () => {
	await conn.close();
	await redis.quit();
};
