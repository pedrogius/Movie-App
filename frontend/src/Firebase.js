import { initializeApp } from 'firebase/app';
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signOut,
} from 'firebase/auth';
import {
	getFirestore,
	doc,
	getDoc,
	getDocs,
	setDoc,
	updateDoc,
	Timestamp,
	collection,
	query,
	where,
} from 'firebase/firestore/lite';
import { isEmpty } from './Utils';
import { merge } from 'lodash';
import axios from 'axios';

const firebaseConfig = {
	apiKey: 'AIzaSyDMGoUBk8GzGNPPUjFGF2nPcnAkpRubUA0',
	authDomain: 'flixar-7ceea.firebaseapp.com',
	projectId: 'flixar-7ceea',
	storageBucket: 'flixar-7ceea.appspot.com',
	messagingSenderId: '37865725591',
	appId: '1:37865725591:web:75fc5d100bb0ef83a213d2',
	measurementId: 'G-1CVS0JQGYY',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
	try {
		const res = await signInWithPopup(auth, googleProvider);
		const { user } = res;
		const { displayName, email, emailVerified, phoneNumber, photoURL, uid } = user;
		const docRef = doc(db, 'users', uid);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			await updateDoc(docRef, {
				lastLogin: Timestamp.now(),
			});
		} else {
			await setDoc(doc(db, 'users', uid), {
				displayName,
				email,
				emailVerified,
				phoneNumber,
				photoURL,
				uid,
				isAdmin: false,
				created: Timestamp.now(),
				lastLogin: Timestamp.now(),
			});
		}
	} catch (err) {
		console.error(err);
		alert(err.message);
	}
};
const signIn = async (email, password) => {
	try {
		await signInWithEmailAndPassword(email, password);
	} catch (err) {
		console.error(err);
		alert(err.message);
	}
};
const register = async (email, password) => {
	try {
		const res = await createUserWithEmailAndPassword(auth, email, password);
		const { user } = res;
		const { emailVerified, uid } = user;
		const docRef = doc(db, 'users', uid);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			await updateDoc(docRef, {
				lastLogin: Timestamp.now(),
			});
		} else {
			await setDoc(doc(db, 'users', uid), {
				email,
				emailVerified,
				uid,
				isAdmin: false,
				created: Timestamp.now(),
				lastLogin: Timestamp.now(),
			});
		}
	} catch (err) {
		console.error(err);
		alert(err.message);
	}
};
const resetPassword = async (email) => {
	try {
		await sendPasswordResetEmail(email);
		alert('Password reset link sent!');
	} catch (err) {
		console.error(err);
		alert(err.message);
	}
};
const logout = () => {
	signOut(auth);
};

const getUser = async (uid) => {
	const docRef = doc(db, 'users', uid);
	const docSnap = await getDoc(docRef);
	return docSnap;
};

const fetchFromDB = async (id, type, country) => {
	const dbName = type === 'movie' ? 'movies' : 'series';
	const docRef = doc(db, dbName, id);
	const docSnap = await getDoc(docRef);

	const options = {
		method: 'GET',
		url: 'https://streaming-availability.p.rapidapi.com/get/basic',
		params: { country, imdb_id: id },
		headers: {
			'x-rapidapi-host': 'streaming-availability.p.rapidapi.com',
			'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
		},
	};

	if (docSnap.exists()) {
		const { streamingInfo } = docSnap.data();
		const availableCountries = {};
		for (const stream in streamingInfo) {
			Object.defineProperty(availableCountries, stream, {
				value: Object.keys(streamingInfo[stream]),
				enumerable: true,
			});
		}
		const isAvailable = (obj, ctry) => {
			let countries = [];
			for (const stream in obj) {
				countries = [...countries, ...obj[stream]];
			}
			if (countries.includes(ctry.toLowerCase())) {
				//checks if document has streaming information
				//on query country and last update was less than a week ago
				const week = 1000 * 60 * 60 * 24 * 7;
				const queryDate = docSnap.data().lastQuery[ctry].toMillis();
				const isExpired = Date.now() - queryDate > week;
				return isExpired ? false : true;
			} else {
				return false;
			}
		};
		if (isAvailable(availableCountries, country)) {
			return docSnap.data();
		} else {
			const { data } = await axios.request(options);
			if (isEmpty(data.streamingInfo)) {
				return docSnap.data();
			} else {
				data.streamingInfo = merge(data.streamingInfo, streamingInfo);
				data.lastQuery = { ...docSnap.data().lastQuery, [country]: Timestamp.now() };
				await updateDoc(docRef, data);
				return data;
			}
		}
	} else {
		const { data } = await axios.request(options);
		data.lastQuery = { [country]: Timestamp.now() };
		data.isOriginal = false;
		await setDoc(docRef, data);
		return data;
	}
};

const fetchRecommended = async (type) => {
	const dbName = type === 'movie' ? 'movies' : 'series';
	const ref = collection(db, dbName);
	const q = query(ref, where('isRecommended', '==', true));
	const querySnapshot = await getDocs(q);
	const arr = [];
	querySnapshot.forEach((doc) => {
		const data = doc.data();
		arr.push({ title: data.originalTitle, id: data.imdbID });
	});
	return arr;
};

const addToRecommended = async (id, type, bool) => {
	const dbName = type === 'movie' ? 'movies' : 'series';
	const docRef = doc(db, dbName, id);
	await updateDoc(docRef, {
		isRecommended: bool,
	});
};

const checkRecommended = async (id, type) => {
	const dbName = type === 'movie' ? 'movies' : 'series';
	const docRef = doc(db, dbName, id);
	const docSnap = await getDoc(docRef);
	if (docSnap.data().isRecommended) {
		return true;
	} else {
		return false;
	}
};
export {
	auth,
	db,
	signInWithGoogle,
	signIn,
	register,
	resetPassword,
	logout,
	getUser,
	fetchFromDB,
	addToRecommended,
	checkRecommended,
	fetchRecommended,
};
