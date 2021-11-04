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

export const genreIDsToName = (arr) => {
	const genres = [
		{
			id: 28,
			name: 'Action',
		},
		{
			id: 12,
			name: 'Adventure',
		},
		{
			id: 16,
			name: 'Animation',
		},
		{
			id: 35,
			name: 'Comedy',
		},
		{
			id: 80,
			name: 'Crime',
		},
		{
			id: 99,
			name: 'Documentary',
		},
		{
			id: 18,
			name: 'Drama',
		},
		{
			id: 10751,
			name: 'Family',
		},
		{
			id: 14,
			name: 'Fantasy',
		},
		{
			id: 36,
			name: 'History',
		},
		{
			id: 27,
			name: 'Horror',
		},
		{
			id: 10402,
			name: 'Music',
		},
		{
			id: 9648,
			name: 'Mystery',
		},
		{
			id: 10749,
			name: 'Romance',
		},
		{
			id: 878,
			name: 'Science Fiction',
		},
		{
			id: 10770,
			name: 'TV Movie',
		},
		{
			id: 53,
			name: 'Thriller',
		},
		{
			id: 10752,
			name: 'War',
		},
		{
			id: 37,
			name: 'Western',
		},
	];
	const names = [];
	arr.forEach((item) => {
		const { name } = genres.find((genre) => genre.id === item);
		names.push(name);
	});
	return names.join(', ');
};
