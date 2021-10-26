import React from 'react';
import { Button } from 'antd';
import { logout } from '../Firebase';

const DashboardScreen = () => {
	return (
		<div>
			<Button onClick={logout}>Sign Out</Button>
		</div>
	);
};

export default DashboardScreen;
