import React, { useEffect, useState } from 'react';
import { Switch, useLocation } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';

const CustomSwitch = ({ children }) => {
	const [progress, setProgress] = useState(false);
	const [prevLoc, setPrevLoc] = useState('');
	const location = useLocation();

	TopBarProgress.config({
		barColors: {
			0: '#ff2424',
			0.5: '#fa3e3e',
			1.0: '#fa6b6b',
		},
		shadowBlur: 5,
		barThickness: 3,
	});

	useEffect(() => {
		setPrevLoc(location.pathname);
		setProgress(true);
		if (location.pathname === prevLoc) {
			setPrevLoc('');
		}
	}, [location]);

	useEffect(() => {
		setProgress(false);
	}, [prevLoc]);

	return (
		<>
			{progress && <TopBarProgress />}
			<Switch>{children}</Switch>
		</>
	);
};

export default CustomSwitch;
