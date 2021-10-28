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
	deleteDoc,
} from 'firebase/firestore';
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
		throw new Error(err);
	}
};
const signIn = async (email, password) => {
	try {
		await signInWithEmailAndPassword(auth, email, password);
	} catch (err) {
		throw new Error(err);
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
		throw new Error(err);
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
	return docSnap.data();
};

const fetchTomatoMeter = async (q, type, year) => {
	const dbName = type === 'series' ? 'tvSeries' : 'movies';
	const queryYear = type === 'series' ? 'startYear' : 'year';
	const options = {
		method: 'GET',
		url: 'https://www.rottentomatoes.com/api/private/v2.0/search/',
		params: { q, limit: 3 },
	};
	const { data } = await axios.request(options);
	if (data[dbName].length === 1) {
		return data[dbName][0].meterScore;
	} else if (data[dbName].length > 1) {
		const item = data[dbName].filter((x) => x[queryYear] === year);
		if (item[0].meterScore) {
			return item[0].meterScore;
		} else {
			return 0;
		}
	} else {
		return 0;
	}
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
				// if its an original (owned by streaming service) it will be 180 days instead of a week
				const week = 1000 * 60 * 60 * 24 * 7;
				const halfYear = 1000 * 60 * 60 * 24 * 180;
				const { isOriginal } = docSnap.data();
				const queryDate = docSnap.data().lastQuery[ctry].toMillis();
				const isExpired = Date.now() - queryDate < isOriginal ? halfYear : week;
				return isExpired;
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
		const tomatoScore = await fetchTomatoMeter(data.title, type, data.year);
		data.tomatoMeter = tomatoScore;
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
		arr.push({
			title: data.title,
			id: data.imdbID,
			image: data.backdropURLs[780],
			year: data.year,
			trailer: data.video,
			tomatoMeter: data.tomatoMeter,
			imdbScore: data.imdbRating,
		});
	});
	return arr;
};

const addToRecommended = async (id, type, bool) => {
	const dbName = type === 'movie' ? 'movies' : 'series';
	const docRef = doc(db, dbName, id);
	const docSnap = await getDoc(docRef);
	if (docSnap.data().backdropURLs[300]) {
		await updateDoc(docRef, {
			isRecommended: bool,
		});
	} else {
		console.error('No backdrop');
	}
};

const makeOriginal = async (id, type, bool) => {
	const dbName = type === 'movie' ? 'movies' : 'series';
	const docRef = doc(db, dbName, id);
	await updateDoc(docRef, {
		isOriginal: bool,
	});
};

const checkRecommended = async (id, type) => {
	const dbName = type === 'movie' ? 'movies' : 'series';
	const docRef = doc(db, dbName, id);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return {
			recommended: docSnap.data().isRecommended,
			original: docSnap.data().isOriginal,
		};
	}
	return;
};

const fetchSuggestions = async (queryText, type) => {
	const dbName = type === 'movie' ? 'movies' : 'series';
	const ref = collection(db, dbName);
	const q = query(ref, where('title', '>=', queryText), where('title', '<=', queryText + '\uf8ff'));
	const querySnapshot = await getDocs(q);
	const arr = [];
	querySnapshot.forEach((doc) => {
		const data = doc.data();
		arr.push({
			title: data.title,
			id: data.imdbID,
			year: data.year,
			poster: data.posterURLs[92],
		});
	});
	return arr;
};

const addToWatchList = async (method, user, item) => {
	if (method === 'add') {
		const itemRef = doc(db, 'users', user, 'watchList', item.id);
		await setDoc(itemRef, item);
	} else {
		const itemRef = doc(db, 'users', user, 'watchList', item.id);
		await deleteDoc(itemRef);
	}
};

const fetchUserWatchList = async (user) => {
	const watchListRef = collection(db, 'users', user, 'watchList');
	const docSnap = await getDocs(watchListRef);
	const watchList = [];
	docSnap.forEach((doc) => watchList.push(doc.data().id));
	return watchList;
};

const getUserProfile = async (id) => {
	const docRef = doc(db, 'users', id);
	try {
		const user = await getDoc(docRef);
		return user.data();
	} catch (e) {
		throw new Error(e);
	}
};

const updateUserProfile = async (user, data) => {
	const docRef = doc(db, 'users', user);
	try {
		await updateDoc(docRef, data);
	} catch (e) {
		throw new Error(e);
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
	makeOriginal,
	fetchTomatoMeter,
	fetchSuggestions,
	addToWatchList,
	fetchUserWatchList,
	updateUserProfile,
	getUserProfile,
};
