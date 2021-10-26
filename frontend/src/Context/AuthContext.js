import React, { useEffect, useState } from 'react';
import { getUser, auth } from '../Firebase';
import { onAuthStateChanged } from '@firebase/auth';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loadingAuthState, setLoadingAuthState] = useState(true);
	const [isAdmin, setIsAdmin] = useState(false);

	onAuthStateChanged(auth, (user) => {
		if (user) {
			setUser(user);
			setLoadingAuthState(false);
		} else {
			setUser(null);
			setLoadingAuthState(false);
		}
	});

	useEffect(() => {
		if (!loadingAuthState && user) {
			setTimeout(() => {
				getUser(user.uid)
					.then((res) => {
						setIsAdmin(res.isAdmin);
					})
					.catch((err) => console.log(err));
			}, 5000);
		}
	}, [user, loadingAuthState]);

	return (
		<AuthContext.Provider value={{ user, isAdmin, loadingAuthState }}>
			{children}
		</AuthContext.Provider>
	);
};
