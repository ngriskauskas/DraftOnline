import 'regenerator-runtime/runtime.js';
import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useGameQuery } from '../../../src/generated/graphql';
import Index from '../../../src/pages/game/[id]/index';
import { mockQuery } from '../../test-utils/mockQuery';

jest.mock('next/router');
jest.mock('../../../src/generated/graphql');
jest.mock('../../../src/components/Navbar', () => {
	return () => {
		return <></>;
	};
});
let game: jest.Mock;
let mockRouter: jest.Mock;
beforeEach(() => {
	mockRouter = (useRouter as jest.Mock).mockReturnValue({ query: { id: 1 } });
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
			const { getByText } = render(<Index pageProps={null} />);
			getByText('Game Title');
		});
	});
});
