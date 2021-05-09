import 'regenerator-runtime/runtime.js';
import React from 'react';
import ChangePassword from '../../src/pages/change-password/[token]';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useChangePasswordMutation } from '../../src/generated/graphql';
import { mockErrorResponse, mockQuery } from '../test-utils/mockQuery';
import router from 'next/router';
import { mocked } from 'ts-jest/utils';

jest.mock('../../src/generated/graphql');
jest.mock('next/router', () => ({
	query: {
		token: 'abc',
	},
	push: jest.fn(),
}));
let changePassword: jest.Mock;
let mockRouter: any;
beforeEach(() => {
	changePassword = mockQuery({ query: useChangePasswordMutation });
	mockRouter = mocked(router.push);
});
describe('change-password page', () => {
	describe('when page loads', () => {
		it('contains correct elements', () => {
			const { getByLabelText, getByText } = render(
				<ChangePassword pageProps={null} />
			);
			getByLabelText('password');
			getByText('Change Password');
		});
	});
	describe('when form is filled and change password is clicked', () => {
		beforeEach(() => {
			changePassword.mockReturnValue({});
		});
		it('redirects to the next page', async () => {
			const { getByText, getByLabelText, findByLabelText } = render(
				<ChangePassword pageProps={null} />
			);
			fireEvent.input(getByLabelText('password'), {
				target: { value: '1234' },
			});
			fireEvent.click(getByText('Change Password'));
			await waitFor(() => {
				expect(changePassword).toHaveBeenCalledWith({
					password: '1234',
					token: 'abc',
				});
			});
			expect(mockRouter).toHaveBeenCalledWith('/');
		});
	});
	describe('when form data is invalid', () => {
		beforeEach(() => {
			changePassword.mockResolvedValue({
				error: mockErrorResponse({
					message: 'Argument Validation Error',
					validationErrors: [
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
				<ChangePassword pageProps={null} />
			);
			fireEvent.input(getByLabelText('password'), {
				target: { value: 'ab' },
			});
			fireEvent.click(getByText('Change Password'));
			await waitFor(() =>
				expect(changePassword).toHaveBeenCalledWith({
					password: 'ab',
					token: 'abc',
				})
			);
			await findByText('password must be at least 4 characters');
			expect(mockRouter).toHaveBeenCalledTimes(0);
		});
	});
	describe('when token has expired', () => {
		beforeEach(() => {
			changePassword.mockResolvedValue({
				error: mockErrorResponse({
					message: 'Change Password Token Expired',
				}),
			});
		});
		it('shows errors on form inputs', async () => {
			const { getByText, findByText, getByLabelText } = render(
				<ChangePassword pageProps={null} />
			);
			fireEvent.input(getByLabelText('password'), {
				target: { value: '1234' },
			});
			fireEvent.click(getByText('Change Password'));
			await waitFor(() =>
				expect(changePassword).toHaveBeenCalledWith({
					password: '1234',
					token: 'abc',
				})
			);
			await findByText('Change Password Token Expired');
			await findByText('Back to Forgot Password');
			expect(mockRouter).toHaveBeenCalledTimes(0);
		});
	});
});
