import 'regenerator-runtime/runtime.js';
import React from 'react';
import Register from '../../src/pages/register';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useRegisterMutation } from '../../src/generated/graphql';
import { mockMutation, mockErrorResponse } from '../test-utils/mockMutation';
import router from 'next/router';
import { mocked } from 'ts-jest/utils';

jest.mock('../../src/generated/graphql');
jest.mock('next/router', () => ({
	query: {},
	push: jest.fn(),
}));
let register: jest.Mock;
let mockRouter: any;
beforeEach(() => {
	register = mockMutation(useRegisterMutation);
	mockRouter = mocked(router.push);
});
describe('register page', () => {
	describe('when page first loads', () => {
		it('contains correct elements', () => {
			const { getByLabelText, getByText } = render(
				<Register pageProps={null} />
			);
			getByLabelText('email');
			getByLabelText('username');
			getByLabelText('password');
			getByText('Register');
		});
	});
	describe('when form is filled and register is clicked', () => {
		beforeEach(() => {
			register.mockReturnValue({});
		});
		it('redirects to the next page', async () => {
			const { getByText, getByLabelText, findByLabelText } = render(
				<Register pageProps={null} />
			);
			fireEvent.input(getByLabelText('email'), {
				target: { value: '123@email.com' },
			});
			fireEvent.input(getByLabelText('username'), {
				target: { value: 'someone' },
			});
			fireEvent.input(getByLabelText('password'), {
				target: { value: '1234' },
			});
			fireEvent.click(getByText('Register'));
			await waitFor(() => {
				expect(register).toHaveBeenCalledWith({
					email: '123@email.com',
					username: 'someone',
					password: '1234',
				});
			});
		});
	});
	describe('when form data is invalid', () => {
		beforeEach(() => {
			register.mockResolvedValue({
				error: mockErrorResponse({
					message: 'Argument Validation Error',
					validationErrors: [
						{ property: 'email', message: 'email must be an email' },
						{
							property: 'username',
							message: 'username must be at least 4 characters',
						},
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
				<Register pageProps={null} />
			);
			fireEvent.input(getByLabelText('email'), {
				target: { value: 'notAnEmail' },
			});
			fireEvent.input(getByLabelText('username'), {
				target: { value: 'ab' },
			});
			fireEvent.input(getByLabelText('password'), {
				target: { value: '12' },
			});
			fireEvent.click(getByText('Register'));
			await waitFor(() => {
				expect(register).toHaveBeenCalledWith({
					email: 'notAnEmail',
					username: 'ab',
					password: '12',
				});
			});
			await findByText('email must be an email');
			await findByText('username must be at least 4 characters');
			await findByText('password must be at least 4 characters');
			expect(mockRouter).toHaveBeenCalledTimes(0);
		});
	});
});
