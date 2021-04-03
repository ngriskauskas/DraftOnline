import { Connection } from 'typeorm';
import { testConn } from '../test-utils/testConn';
import { gCall } from '../test-utils/gCall';

let conn: Connection;

beforeAll(async () => {
	conn = await testConn();
});

afterAll(async () => {
	await conn.close();
});

const thing: string = `
mutation {
	createPost(title: "another test post") {
		id
    title
  }
}`;

describe('something', () => {
	it('does stuff', async () => {
		const stuff = await gCall({
			source: thing,
		});

		console.log(stuff);
	});
});
