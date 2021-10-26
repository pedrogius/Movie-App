import React, { useContext } from 'react';
import { Spin } from 'antd';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const PrivateRoute = ({ children, ...rest }) => {
	const { user, loadingAuthState } = useContext(AuthContext);

	return (
		<Route
			{...rest}
			render={({ location }) => {
				return loadingAuthState ? (
					<Spin />
				) : user ? (
					children
				) : (
					<Redirect to={{ pathname: '/login', state: { from: location } }} />
				);
			}}
		/>
	);
};

export default PrivateRoute;
