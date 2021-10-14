import React, { useEffect, useState } from 'react';
import { auth, getUser } from '../Firebase';
import { onAuthStateChanged } from '@firebase/auth';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				const userDataFromDB = await getUser(user.uid);
				setIsAdmin(userDataFromDB.data().isAdmin);
				setUser(user);
			} else {
				setUser(null);
			}
		});
	}, []);

	return <AuthContext.Provider value={{ user, isAdmin }}>{children}</AuthContext.Provider>;
};
