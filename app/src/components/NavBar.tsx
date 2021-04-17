import { Box, Flex, Link } from '@chakra-ui/layout';
import React, { FC } from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { Button } from '@chakra-ui/button';
import { isServer } from '../utils/isServer';

interface NavBarProps {}

const NavBar: FC<NavBarProps> = ({}) => {
	const [{ data, fetching }] = useMeQuery();
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
	let userInfoBody = null;
	if (fetching) {
	} else if (!data?.me) {
		userInfoBody = (
			<>
				<NextLink href='/login'>
					<Link color='white' mr={2}>
						login
					</Link>
				</NextLink>
				<NextLink href='/register'>
					<Link color='white'>register</Link>
				</NextLink>
			</>
		);
	} else {
		userInfoBody = (
			<Flex>
				<Box mr={2}>{data.me.username}</Box>
				<Button variant='link' onClick={() => logout()} isLoading={logoutFetching}>
					Logout
				</Button>
			</Flex>
		);
	}
	return (
		<Flex bg='tomato' p={4}>
			<Box ml={'auto'}>{userInfoBody}</Box>
		</Flex>
	);
};

export default NavBar;
