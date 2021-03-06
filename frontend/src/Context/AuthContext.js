import React, { useEffect, useState } from 'react';
import { auth, db } from '../Firebase';
import { onAuthStateChanged } from '@firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [loadingAuthState, setLoadingAuthState] = useState(true);

	onAuthStateChanged(auth, (user) => {
		if (user) {
			setUser(user);
		} else {
			setUser(null);
		}
		setLoadingAuthState(false);
	});

	useEffect(() => {
		if (user) {
			const unsub = onSnapshot(doc(db, 'users', user.uid), (doc) => {
				const data = doc.data();
				setIsAdmin(data?.isAdmin);
			});
			return () => {
				unsub();
			};
		}
	}, [user]);

	return (
		<AuthContext.Provider value={{ user, isAdmin, loadingAuthState }}>
			{children}
		</AuthContext.Provider>
	);
};
