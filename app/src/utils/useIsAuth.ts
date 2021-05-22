import router from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';

export const useIsAuth = () => {
	const [{ data, fetching }] = useMeQuery();
	useEffect(() => {
		if (!fetching && !data?.me) {
			let pathName = router.pathname;
			if (router.query && router.query.id)
				pathName = router.pathname.replace('[id]', String(router.query.id));
			router.replace('/login?next=' + pathName);
		}
	}, [fetching, data]);
};
