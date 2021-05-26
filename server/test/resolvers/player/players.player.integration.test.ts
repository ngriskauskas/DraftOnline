import { User } from '../../../src/entities/User';
import { createSession } from '../../test-utils/createSession';
import { initTestServer, closeTestServer } from '../../test-utils/testServer';
import { Express } from 'express';

let app: Express;
let session: any;
let user: User | undefined;
beforeAll(async () => {
	app = await initTestServer();
});

afterAll(async () => {
	await closeTestServer();
});

const teamsQuery = `
query Players($gameId: Int!) {
	players(input: {gameId: $gameId}) {
		id
    position
    team {
			id
    }
  }
}`;

beforeAll(async () => {
	({ session, user } = await createSession(app, true));
});

describe('Player Query: players', () => {});
