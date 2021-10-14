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

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
