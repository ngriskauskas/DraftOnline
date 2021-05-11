import 'regenerator-runtime/runtime.js';
import router from 'next/router';
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { GameStatus, useGamesQuery } from '../../src/generated/graphql';
import { mockQuery } from '../test-utils/mockQuery';
import Index from '../../src/pages/index';

jest.mock('../../src/generated/graphql');
jest.mock('../../src/components/Navbar', () => {
	return () => {
		return <></>;
	};
});
jest.mock('next/router', () => ({
	query: {},
	push: jest.fn(),
}));
let games: jest.Mock;
let mockRouter: any;
beforeEach(() => {
	mockRouter = mocked(router.push);
});
describe('index page', () => {
	describe('when page first loads and games are loading', () => {
		beforeEach(() => {
			games = mockQuery({
				query: useGamesQuery,
				fetching: true,
			});
		});
		it('contains correct elements', async () => {
			const { getByText, findByText } = render(<Index pageProps={null} />);
			getByText('Draft Online');
			getByText('Create New Game');
			getByText('Loading...');
			fireEvent.scroll(window);
			await findByText('Loading...');
		});
	});
	describe('when games loaded', () => {
		beforeEach(() => {
			games = mockQuery({
				query: useGamesQuery,
				data: {
					games: Array(10)
						.fill(1)
						.map((_, i) => ({
							id: i,
							createdAt: 1,
							updatedAt: 1,
							title: 'Game Title',
							status:
								i < 5
									? GameStatus.Open
									: i < 8
									? GameStatus.Complete
									: GameStatus.Active,
							creator: {
								id: 0,
								username: 'user',
							},
							meJoined: i < 2 ? true : false,
						})),
				},
			});
		});
		it('contains game elements', () => {
			const { getByText, getAllByText } = render(<Index pageProps={null} />);
			getByText('Draft Online');
			getByText('Create New Game');
			expect(getAllByText('Game Title')).toHaveLength(10);
			expect(getAllByText('user')).toHaveLength(10);
			expect(getAllByText('Open')).toHaveLength(3);
			expect(getAllByText('Complete')).toHaveLength(3);
			expect(getAllByText('Active')).toHaveLength(2);
			expect(getAllByText('Join')).toHaveLength(3);
			expect(getAllByText('Joined')).toHaveLength(2);
		});
	});
	describe('when scroll to end of page', () => {
		beforeEach(() => {
			games = mockQuery({
				query: useGamesQuery,
				data: {
					games: Array(10)
						.fill(0)
						.map((_, i) =>
							i === 0
								? null
								: {
										id: i,
										createdAt: i,
										updatedAt: 0,
										title: 'Game Title',
										creator: {
											id: 1,
											username: 'user',
										},
								  }
						),
				},
			});
		});
		it('loads more games', async () => {
			const mockedUseGamesQuery = useGamesQuery as jest.Mock;
			render(<Index pageProps={null} />);

			fireEvent.scroll(window);
			await waitFor(() => {
				expect(mockedUseGamesQuery).toHaveBeenCalledWith({
					variables: {
						cursor: 9,
						limit: 25,
					},
				});
			});
		});
	});
});
