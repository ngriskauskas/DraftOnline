import 'regenerator-runtime/runtime.js';
import { fireEvent, render, waitFor } from '@testing-library/react';
import router from 'next/router';
import { mocked } from 'ts-jest/utils';
import NavBar from '../../src/components/NavBar';
import { useLogoutMutation } from '../../src/generated/graphql';
import { mockMeQuery } from '../test-utils/mockMeQuery';
import { mockQuery } from '../test-utils/mockQuery';
import React from 'react';

jest.mock('../../src/generated/graphql');
jest.mock('next/router', () => ({
	reload: jest.fn(),
}));
let logout: jest.Mock;
let mockRouter: any;
beforeEach(() => {
	logout = mockQuery({ query: useLogoutMutation });
	mockRouter = mocked(router);
});
describe('NavBar', () => {
	describe('when user is not logged in', () => {
		beforeEach(() => {
			mockMeQuery(false);
		});
		describe('and navbar loads', () => {
			it('displays correct elements', () => {
				const { getByText } = render(<NavBar />);
				getByText('register');
				getByText('login');
			});
		});
	});
	describe('when user is logged in', () => {
		beforeEach(() => {
			mockMeQuery(true);
		});
		describe('and navbar loads', () => {
			it('displays correct elements', () => {
				const { getByText } = render(<NavBar />);
				getByText('logout');
				getByText('test');
			});
		});
		describe('and logout is clicked', () => {
			beforeEach(() => {
				logout = mockQuery({ query: useLogoutMutation });
			});
			it('display correct elements', async () => {
				const { getByText } = render(<NavBar />);
				fireEvent.click(getByText('logout'));
				await waitFor(() => expect(logout).toHaveBeenCalled());
				expect(mockRouter.reload).toHaveBeenCalled();
			});
		});
		describe('and me is fetching', () => {
			beforeEach(() => {
				mockMeQuery(true, true);
			});
			it('displays correct elements', async () => {
				const { queryByText } = render(<NavBar />);
				expect(queryByText('login')).toBe(null);
				expect(queryByText('register')).toBe(null);
				expect(queryByText('test')).toBe(null);
			});
		});
	});
});
