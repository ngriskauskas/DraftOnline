import { useEffect } from 'react';

export const useScroll = (onScrolled: () => void) => {
	const onScroll = () => {
		if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
			onScrolled();
		}
	};
	useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	});
};
