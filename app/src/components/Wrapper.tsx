import { Box } from '@chakra-ui/layout';
import React, { FC } from 'react';

export type WrapperVariant = 'small' | 'regular';

interface wrapperProps {
	variant?: WrapperVariant;
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
