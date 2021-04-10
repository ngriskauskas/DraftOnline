import { withUrqlClient } from 'next-urql';
import NavBar from '../components/NavBar';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
	return (
		<>
			<NavBar />
			<div>Hello wolrd</div>
		</>
	);
};
export default withUrqlClient(createUrqlClient)(Index);
