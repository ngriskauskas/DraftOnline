import 'regenerator-runtime/runtime.js';
import React from 'react';
import ForgotPassword from '../../src/pages/forgot-password';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { useForgotPasswordMutation } from '../../src/generated/graphql';
import { mockMutation, mockErrorResponse } from '../test-utils/mockMutation';
import router from 'next/router';
import { mocked } from 'ts-jest/utils';

jest.mock('../../src/generated/graphql');
jest.mock('next/router', () => ({
	query: {},
	push: jest.fn(),
}));
let forgotPassword: jest.Mock;
let mockRouter: any;
beforeEach(() => {
	forgotPassword = mockMutation(useForgotPasswordMutation);
	mockRouter = mocked(router.push);
});
describe('login page', () => {
	describe('when page first loads', () => {
		it('contains correct elements', () => {
			const { getByLabelText, getByText } = render(
				<ForgotPassword pageProps={null} />
			);
			getByLabelText('email');
			getByText('Send Email');
		});
	});
	describe('when form is filled and send email is clicked', () => {
		beforeEach(() => {
			forgotPassword.mockReturnValue({});
		});
		it('displays email sent message', async () => {
			const { getByText, getByLabelText, findByText } = render(
				<ForgotPassword pageProps={null} />
			);
			fireEvent.input(getByLabelText('email'), {
				target: { value: '123@email.com' },
			});
			fireEvent.click(getByText('Send Email'));

			await waitFor(() =>
				expect(forgotPassword).toHaveBeenCalledWith({
					email: '123@email.com',
				})
			);
			await findByText('Email Sent');
		});
	});
});
