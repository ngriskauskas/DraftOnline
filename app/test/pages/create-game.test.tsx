import 'regenerator-runtime/runtime.js';
import router from 'next/router';
import React from 'react';
import { mocked } from 'ts-jest/utils';
import { useCreateGameMutation } from '../../src/generated/graphql';
import { mockErrorResponse, mockQuery } from '../test-utils/mockQuery';
import CreateGame from '../../src/pages/create-game';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { mockMeQuery } from '../test-utils/mockMeQuery';

jest.mock('../../src/components/Navbar', () => {
	return () => {
		return <></>;
	};
});
jest.mock('../../src/generated/graphql');
jest.mock('next/router', () => ({
	push: jest.fn(),
	replace: jest.fn(),
	pathname: 'test',
}));
let createGame: jest.Mock;
let mockRouter: any;
beforeEach(() => {
	createGame = mockQuery({ query: useCreateGameMutation });
	mockRouter = mocked(router);
});

describe('create-game page', () => {
	describe('when page first loads', () => {
		beforeEach(() => {
			mockMeQuery(true);
			createGame.mockReturnValue({});
		});
		it('contains correct elements', () => {
			const { getByLabelText, getByText } = render(
				<CreateGame pageProps={null} />
			);
			getByLabelText('title');
			getByText('create game');
		});
	});
	describe('when form is valid and create game is clicked', () => {
		beforeEach(() => {
			mockMeQuery(true);
			createGame.mockReturnValue({});
		});
		it('redirects to home page', async () => {
			const { getByLabelText, getByText } = render(
				<CreateGame pageProps={null} />
			);
			fireEvent.input(getByLabelText('title'), {
				target: { value: 'Test' },
			});
			fireEvent.click(getByText('create game'));
			await waitFor(() => {
				expect(createGame).toHaveBeenCalledWith({
					title: 'Test',
				});
			});
			expect(mockRouter.push).toHaveBeenCalledWith('/');
		});
	});
	describe('when form is invalid and create game is clicked', () => {
		beforeEach(() => {
			mockMeQuery(true);
			createGame.mockResolvedValue({
				error: mockErrorResponse({
					message: 'Argument Validation Error',
					validationErrors: [
						{
							property: 'title',
							message: 'title must be at least 4 characters',
						},
					],
				}),
			});
		});
		it('shows errors on form inputs', async () => {
			const { getByLabelText, getByText, findByText } = render(
				<CreateGame pageProps={null} />
			);
			fireEvent.input(getByLabelText('title'), {
				target: { value: '' },
			});
			fireEvent.click(getByText('create game'));
			await waitFor(() =>
				expect(createGame).toHaveBeenCalledWith({
					title: '',
				})
			);
			await findByText('title must be at least 4 characters');
			expect(mockRouter.push).toHaveBeenCalledTimes(0);
		});
	});
	describe('when page loads and not logged in', () => {
		beforeEach(() => {
			mockMeQuery(false);
		});
		it('redirects to login page', async () => {
			render(<CreateGame pageProps={null} />);
			await waitFor(() =>
				expect(mockRouter.replace).toHaveBeenCalledWith('/login?next=test')
			);
		});
	});
});
