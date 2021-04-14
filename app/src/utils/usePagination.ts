import { useEffect } from 'react';

export const usePagination = (updateCursor: () => void) => {
	const onScroll = () => {
		if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
			updateCursor();
		}
	};
	useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	});
};
