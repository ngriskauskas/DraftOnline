import 'regenerator-runtime/runtime.js';
import React from 'react';
import Login from '../../src/pages/login';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useLoginMutation } from '../../src/generated/graphql';
import { mockMutation, mockErrorResponse } from '../test-utils/mockMutation';
import router from 'next/router';
import { mocked } from 'ts-jest/utils';

jest.mock('../../src/generated/graphql');
jest.mock('next/router', () => ({
	query: {},
	push: jest.fn(),
}));
let login: jest.Mock;
let mockRouter: any;
beforeEach(() => {
	login = mockMutation(useLoginMutation);
	mockRouter = mocked(router.push);
});
describe('login page', () => {
	describe('when page first loads', () => {
		it('contains correct elements', () => {
			const { getByLabelText, getByText } = render(<Login pageProps={null} />);
			getByLabelText('email');
			getByLabelText('password');
			getByText('login');
			getByText('Forgot Password');
		});
	});
	describe('when form is filled and login is clicked', () => {
		beforeEach(() => {
			login.mockReturnValue({});
		});
		it('redirects to the next page and logs user in', async () => {
			const { getByText, getByLabelText, findByLabelText } = render(
				<Login pageProps={null} />
			);
			fireEvent.input(getByLabelText('email'), {
				target: { value: '123@email.com' },
			});
			fireEvent.input(getByLabelText('password'), {
				target: { value: '1234' },
			});
			fireEvent.click(getByText('login'));

			await waitFor(() =>
				expect(login).toHaveBeenCalledWith({
					email: '123@email.com',
					password: '1234',
				})
			);
			expect(mockRouter).toHaveBeenCalledWith('/');
		});
	});
	describe('when form data is invalid', () => {
		beforeEach(() => {
			login.mockResolvedValue({
				error: mockErrorResponse({
					message: 'Argument Validation Error',
					validationErrors: [
						{ property: 'email', message: 'email must be an email' },
						{
							property: 'password',
							message: 'password must be at least 4 characters',
						},
					],
				}),
			});
		});
		it('shows errors on form inputs', async () => {
			const { getByText, findByText, getByLabelText } = render(
				<Login pageProps={null} />
			);
			fireEvent.input(getByLabelText('email'), {
				target: { value: 'notAnEmail' },
			});
			fireEvent.input(getByLabelText('password'), {
				target: { value: 'ab' },
			});
			fireEvent.click(getByText('login'));
			await waitFor(() =>
				expect(login).toHaveBeenCalledWith({
					email: 'notAnEmail',
					password: 'ab',
				})
			);
			await findByText('email must be an email');
			await findByText('password must be at least 4 characters');
			expect(mockRouter).toHaveBeenCalledTimes(0);
		});
	});
});
