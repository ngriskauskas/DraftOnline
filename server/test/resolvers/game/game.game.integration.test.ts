import { closeTestServer, initTestServer } from '../../test-utils/testServer';
import { Express } from 'express';
import { createSession } from '../../test-utils/createSession';
import { Game } from '../../../src/entities/Game';
import { User } from '../../../src/entities/User';
import { Manager } from '../../../src/entities/Manager';

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
		meJoined
  }
}`;

beforeAll(async () => {
	({ session, user } = await createSession(app, true));

	await Game.create({
		creator: user!,
		title: 'Test',
		managers: [
			Manager.create({
				user,
			}),
		],
	}).save();
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
				meJoined: true,
			});
		});
	});
	describe('when user is not logged in', () => {
		it('returns game', async () => {
			const { session } = await createSession(app);
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
				meJoined: false,
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
