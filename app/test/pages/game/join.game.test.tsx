import 'regenerator-runtime/runtime.js';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import React from 'react';
import {
	useGameQuery,
	useJoinGameMutation,
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
const push = jest.fn();
beforeEach(() => {
	mockRouter = (useRouter as jest.Mock).mockReturnValue({
		query: { id: 1 },
		push,
	});
});

describe('game page', () => {
	describe('when page loads', () => {
		beforeEach(() => {
			mockMeQuery(true);
			joinGame = mockQuery({ query: useJoinGameMutation });
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
		it('contains correct elements', () => {
			const { getByText } = render(<Join pageProps={null} />);
			getByText('Game Title');
			getByText('join');
		});
	});
	describe('when form is valid and join is clicked', () => {
		beforeEach(() => {
			mockMeQuery(true);
			joinGame = mockQuery({ query: useJoinGameMutation });
			joinGame.mockResolvedValue({});
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
		it('redirects user to game', async () => {
			const { getByText } = render(<Join pageProps={null} />);
			fireEvent.click(getByText('join'));
			await waitFor(() => expect(joinGame).toHaveBeenCalledWith({ id: 1 }));
			expect(push).toHaveBeenCalledWith('/game/1');
		});
	});
	describe('when form is invalid and join is clicked', () => {
		beforeEach(() => {
			mockMeQuery(true);
			joinGame = mockQuery({ query: useJoinGameMutation });
			joinGame.mockResolvedValue(
				mockErrorResponse({ message: 'User Already Joined' })
			);
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
		it('displays errors', async () => {
			const { getByText } = render(<Join pageProps={null} />);
			fireEvent.click(getByText('join'));
			await waitFor(() => expect(joinGame).toHaveBeenCalledWith({ id: 1 }));
			getByText('User Already Joined');
		});
	});
});
