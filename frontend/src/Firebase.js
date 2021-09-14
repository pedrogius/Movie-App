import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite';

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
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
	try {
		const res = await signInWithPopup(auth, googleProvider);
		const credential = GoogleAuthProvider.credentialFromResult(res);
		const token = credential.accessToken;
		const user = res.user;
		console.log(user, token, credential);
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
const register = async (name, email, password) => {
	try {
		const res = await createUserWithEmailAndPassword(email, password);
		const user = res.user;
		await db.collection('users').add({
			uid: user.uid,
			name,
			authProvider: 'local',
			email,
		});
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
export { auth, db, signInWithGoogle, signIn, register, resetPassword, logout };
