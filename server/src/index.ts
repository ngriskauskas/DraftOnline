import { Connection, createConnection } from 'typeorm';
import ormConfig from './config/ormconfig';
import { createApp } from './config/server';
import Redis from 'ioredis';

let conn: Connection;
let redis: Redis.Redis;

const main = async () => {
	conn = await createConnection(ormConfig);
	redis = new Redis();
	const app = await createApp(conn, redis);
	app.listen(4000, () => {
		console.log('server listening on http://localhost:4000');
	});
};

main().catch(async (err) => {
	await conn.close();
	await redis.quit();
	console.error(err);
});
