import React, { useEffect, useState } from 'react';
import { auth, getUser } from '../Firebase';
import { onAuthStateChanged } from '@firebase/auth';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);
			} else {
				setUser(null);
			}
		});
	}, []);

	useEffect(() => {
		if (user) {
			getUser(user.uid)
				.then((res) => {
					setIsAdmin(res.isAdmin);
				})
				.catch((err) => console.log(err));
		}
	}, [user]);

	return <AuthContext.Provider value={{ user, isAdmin }}>{children}</AuthContext.Provider>;
};
