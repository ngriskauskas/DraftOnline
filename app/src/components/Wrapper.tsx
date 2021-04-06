import { Box } from '@chakra-ui/layout';
import React, { FC } from 'react';

interface wrapperProps {
	variant?: 'small' | 'regular';
}

const Wrapper: FC<wrapperProps> = ({ children, variant }) => {
	return (
		<Box
			mt={8}
			mx='auto'
			maxW={variant === 'regular' ? '800px ' : '400px'}
			w='100%'>
			{children}
		</Box>
	);
};

export default Wrapper;
