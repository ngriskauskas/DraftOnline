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

const gamesQuery = `
query Games($limit: Int!, $cursor: String) {
  games(input: { limit: $limit, cursor: $cursor }) {
    id
    createdAt
    updatedAt
    title
    creator {
      id
      username
    }
  }
}`;

beforeAll(async () => {
	({ session, user } = await createSession(app, true));
	for (let i = 0; i < 10; i++) {
		await Game.insert({
			creator: user,
			title: `Test ${i}`,
		});
	}
});

describe('Game Query: games', () => {
	describe('when games are queried without cursor', () => {
		it('returns limit number of games', async () => {
			const gamesResponse = await session.post('/graphql').send({
				query: gamesQuery,
				variables: {
					limit: 3,
				},
			});
			expect(gamesResponse.body.data.games).toHaveLength(3);
		});
	});
	describe('when games are queried with cursor', () => {
		it('returns limit number of games', async () => {
			const initialGamesResponse = await session.post('/graphql').send({
				query: gamesQuery,
				variables: {
					limit: 3,
				},
			});
			const cursor = initialGamesResponse.body.data.games[0].createdAt;
			const gamesResponse = await session.post('/graphql').send({
				query: gamesQuery,
				variables: {
					limit: 3,
					cursor,
				},
			});
			expect(gamesResponse.body.data.games).toHaveLength(3);
			expect(gamesResponse.body.data.games[0].id).toBe(9);
		});
	});
});
