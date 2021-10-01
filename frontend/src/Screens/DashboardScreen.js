import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import { logout } from '../Firebase';
import { AuthContext } from '../Context/AuthContext';

const DashboardScreen = () => {
	const history = useHistory();
	const { user } = useContext(AuthContext);

	useEffect(() => {
		if (!user) history.replace('/login');
	}, [user, history]);
	return (
		<div>
			<Button onClick={logout}>Sign Out</Button>
		</div>
	);
};

export default DashboardScreen;
