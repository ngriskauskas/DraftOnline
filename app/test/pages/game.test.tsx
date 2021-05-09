import { render } from '@testing-library/react';
import router from 'next/router';
import React from 'react';
import { mocked } from 'ts-jest/utils';
import { useGameQuery } from '../../src/generated/graphql';
import Game from '../../src/pages/game/[id]';
import { mockQuery } from '../test-utils/mockQuery';

jest.mock('next/router', () => ({
	query: {},
	push: jest.fn(),
}));
jest.mock('../../src/generated/graphql');
jest.mock('../../src/components/Navbar', () => {
	return () => {
		return <></>;
	};
});
let game: jest.Mock;
let mockRouter: any;
beforeEach(() => {
	mockRouter = mocked(router.push);
});
describe('game page', () => {
	describe('when page loads', () => {
		beforeEach(() => {
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
			const { getByText } = render(<Game pageProps={null} />);
			getByText('Game Title');
		});
	});
});
