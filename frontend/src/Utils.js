export const isEmpty = (obj) => {
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) return false;
	}
	return true;
};

export const makeString = (arr) => {
	if (arr.length === 1) return arr[0];
	const firsts = arr.slice(0, arr.length - 1);
	const last = arr[arr.length - 1];
	return firsts.join(', ') + ' and ' + last;
};

export const minutesToHoursAndMinutes = (num) =>
	num > 60 ? Math.floor(num / 60) + 'h ' + (num % 60) + 'm' : num + 'm';

export const capitalize = (str) =>
	str
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

export class FirebaseError extends Error {
	constructor(e) {
		super(e);
		const err = e.message.split('Error ')[1].slice(1, -2).split('/');
		this.type = err[0];
		this.message = capitalize(err[1].split('-').join(' '));
	}
}
