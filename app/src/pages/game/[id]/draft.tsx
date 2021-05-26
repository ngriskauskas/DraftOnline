import { withUrqlClient } from 'next-urql';
import React, { FC } from 'react';
import GameLayout from '../../../components/GameLayout';
import { createUrqlClient } from '../../../graphql/client/createUrqlClient';

interface draftProps {}

const Draft: FC<draftProps> = ({}) => {
	return <GameLayout>draft</GameLayout>;
};

export default withUrqlClient(createUrqlClient)(Draft);
