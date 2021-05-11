import router from 'next/router';
import { mocked } from 'ts-jest/utils';
import { useMeQuery } from '../../src/generated/graphql';
import { useIsAuth } from '../../src/utils/useIsAuth';
import { mockQuery } from '../test-utils/mockQuery';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('../../src/generated/graphql');
jest.mock('next/router', () => ({
	replace: jest.fn(),
	pathname: 'test',
}));
let me: jest.Mock;
let mockRouter: any;
beforeEach(() => {
	mockRouter = mocked(router.replace);
});

describe('useIsAuth', () => {
	describe('when logged in and not fetching', () => {
		beforeEach(() => {
			me = mockQuery({
				query: useMeQuery,
				data: {
					me: {},
				},
			});
		});
		it('does nothing', () => {
			renderHook(() => useIsAuth());
			expect(mockRouter.mock.calls).toHaveLength(0);
		});
	});
	describe('when logged in and fetching', () => {
		beforeEach(() => {
			me = mockQuery({
				query: useMeQuery,
				data: {
					me: {},
				},
				fetching: true,
			});
		});
		it('does nothing', () => {
			renderHook(() => useIsAuth());
			expect(mockRouter.mock.calls).toHaveLength(0);
		});
	});
	describe('when not logged in and fetching', () => {
		beforeEach(() => {
			me = mockQuery({
				query: useMeQuery,
				fetching: true,
			});
		});
		it('does nothing', () => {
			renderHook(() => useIsAuth());
			expect(mockRouter.mock.calls).toHaveLength(0);
		});
	});
	describe('when not logged in and not fetching', () => {
		beforeEach(() => {
			me = mockQuery({
				query: useMeQuery,
				data: {},
			});
		});
		it('does nothing', () => {
			renderHook(() => useIsAuth());
			expect(mockRouter.mock.calls[0][0]).toEqual('/login?next=test');
		});
	});
});
