import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const CountryContext = React.createContext();

export const CountryProvider = ({ children }) => {
	const [country, setCountry] = useState(window.localStorage.getItem('userCountry'));
	const getCountry = async () => {
		if (!window.localStorage.getItem('userCountry')) {
			try {
				const res = await axios.get('http://localhost:5000/getip');
				if (res.data) {
					setCountry(res.data);
					window.localStorage.setItem('userCountry', res.data);
				} else {
					setCountry('US');
					window.localStorage.setItem('userCountry', 'US');
				}
			} catch (e) {
				setCountry('US');
				console.log(e);
			}
		}
	};

	useEffect(() => {
		const func = async () => {
			await getCountry();
		};
		func();
	}, [country]);
	return (
		<CountryContext.Provider value={{ country, setCountry }}>{children}</CountryContext.Provider>
	);
};
