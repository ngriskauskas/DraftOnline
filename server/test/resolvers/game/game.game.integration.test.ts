import { closeTestServer, initTestServer } from '../../test-utils/testServer';
import { Express } from 'express';
import { createSession } from '../../test-utils/createSession';
import { Game } from '../../../src/entities/Game';
import { User } from '../../../src/entities/User';
import { GameUser } from '../../../src/entities/GameUser';

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
		meGameUser {
			userId
			gameId
		}
  }
}`;

beforeAll(async () => {
	({ session, user } = await createSession(app, true));
	const game = new Game();
	game.creator = user!;
	game.title = 'Test';
	await game.save();

	const gameUser = new GameUser();
	gameUser.userId = user!.id;
	gameUser.gameId = game.id;
	await gameUser.save();
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
				meGameUser: {
					gameId: 1,
					userId: 1,
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
