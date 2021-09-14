import React, { useEffect, useState } from 'react';
import { auth } from '../Firebase';
import { onAuthStateChanged } from '@firebase/auth';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);
			} else {
				setUser(null);
			}
		});
	}, []);

	return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};
