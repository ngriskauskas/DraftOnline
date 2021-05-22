import 'regenerator-runtime/runtime.js';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import React from 'react';
import {
	useGameQuery,
	useJoinGameMutation,
	useTeamsQuery,
} from '../../../src/generated/graphql';
import Join from '../../../src/pages/game/[id]/join';
import { mockMeQuery } from '../../test-utils/mockMeQuery';
import { mockErrorResponse, mockQuery } from '../../test-utils/mockQuery';

jest.mock('next/router');
jest.mock('../../../src/generated/graphql');
jest.mock('../../../src/components/Navbar', () => {
	return () => {
		return <></>;
	};
});
let game: jest.Mock;
let joinGame: jest.Mock;
let mockRouter: any;
let teams: jest.Mock;
const push = jest.fn();
beforeEach(() => {
	mockRouter = (useRouter as jest.Mock).mockReturnValue({
		query: { id: 1 },
		push,
	});
	joinGame = mockQuery({ query: useJoinGameMutation });
	joinGame.mockResolvedValue({});
	mockMeQuery(true);
	teams = mockQuery({
		query: useTeamsQuery,
		data: {
			teams: [
				{
					id: 1,
					name: 'Team 1',
					manager: null,
				},
				{
					id: 2,
					name: 'Team 2',
					manager: {
						id: 1,
						username: 'someone',
					},
				},
			],
		},
	});
	game = mockQuery({
		query: useGameQuery,
		data: {
			game: {
				id: 1,
				createdAt: 1,
				updatedAt: 1,
				title: 'Game Title',
				creator: {
					id: 1,
					username: 'user',
				},
			},
		},
	});
});

describe('game page', () => {
	describe('when page loads', () => {
		it('contains correct elements', () => {
			const { getByText } = render(<Join pageProps={null} />);
			getByText('Game Title');
			getByText('Team 1');
			getByText('Team 2');
			getByText('join');
		});
	});
	describe('when form is valid and join is clicked', () => {
		it('redirects user to game', async () => {
			const { getByText } = render(<Join pageProps={null} />);
			fireEvent.click(getByText('Team 1'));
			fireEvent.click(getByText('join'));
			await waitFor(() =>
				expect(joinGame).toHaveBeenCalledWith({ id: 1, teamId: 1 })
			);
			expect(push).toHaveBeenCalledWith('/game/1');
		});
	});
	describe('when form is invalid and join is clicked', () => {
		beforeEach(() => {
			const thing = mockErrorResponse({ message: 'User Already Joined' });
			joinGame.mockResolvedValue({
				error: mockErrorResponse({ message: 'User Already Joined' }),
			});
		});
		it('displays errors', async () => {
			const { getByText } = render(<Join pageProps={null} />);
			fireEvent.click(getByText('Team 1'));
			fireEvent.click(getByText('join'));
			await waitFor(() =>
				expect(joinGame).toHaveBeenCalledWith({ id: 1, teamId: 1 })
			);
			getByText('User Already Joined');
		});
	});
});
