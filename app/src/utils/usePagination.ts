import { useEffect, useState } from 'react';

export interface usePaginationProps {
	data: any;
	fetching: boolean;
}

export const usePagination = ({ data, fetching }: usePaginationProps) => {
	const [num, setNum] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	useEffect(() => {
		let length = 0;
		if (data) length = Object.values(data as Object)[0].length as number;
		setHasMore(fetching || num < length);
		setNum(length);
	}, [data, fetching]);

	return hasMore;
};
