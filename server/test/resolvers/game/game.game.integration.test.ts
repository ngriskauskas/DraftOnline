import { closeTestServer, initTestServer } from '../../test-utils/testServer';
import { Express } from 'express';
import { createSession } from '../../test-utils/createSession';
import { Game } from '../../../src/entities/Game';
import { User } from '../../../src/entities/User';

let app: Express;
let session: any;
let user: User | undefined;

beforeAll(async () => {
	app = await initTestServer();
});

afterAll(async () => {
	await closeTestServer();
});

const gameQuery = `
query Game($id: Int!) {
  game(id: $id) {
    id
    title
    creator {
      id
      username
    }
  }
}`;

beforeAll(async () => {
	({ session, user } = await createSession(app, true));
	await Game.insert({
		creator: user,
		title: 'Test',
	});
});

describe('Game Query: game', () => {
	describe('when game id exists', () => {
		it('returns game', async () => {
			const gameResponse = await session.post('/graphql').send({
				query: gameQuery,
				variables: {
					id: 1,
				},
			});
			expect(gameResponse.body.data.game).toEqual({
				id: 1,
				title: 'Test',
				creator: {
					id: 1,
					username: 'username',
				},
			});
		});
	});
	describe('when game id does not exist', () => {
		it('returns null', async () => {
			const gameResponse = await session.post('/graphql').send({
				query: gameQuery,
				variables: {
					id: -1,
				},
			});
			expect(gameResponse.body.data.game).toEqual(null);
		});
	});
});
