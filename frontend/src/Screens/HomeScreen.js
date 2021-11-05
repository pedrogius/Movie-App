import React, { useState, useEffect } from 'react';
import { fetchRecommended } from '../Firebase';
import Carousel from '../Components/Carousel';
import { Skeleton } from 'antd';

const HomeScreen = () => {
	const [recommendedMovies, setRecommendedMovies] = useState(null);
	const [recommendedSeries, setRecommendedSeries] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchRecommended('movie')
			.then((res) => setRecommendedMovies(res))
			.catch((e) => console.log(e));
		fetchRecommended('series')
			.then((res) => {
				setRecommendedSeries(res);
				setIsLoading(false);
			})
			.catch((e) => console.log(e));
	}, []);

	return (
		<div>
			{isLoading ? (
				<Skeleton active />
			) : (
				<>
					<Carousel data={recommendedMovies} title="Recommended Movies" type="movie" />
					<Carousel data={recommendedSeries} title="Recommended Series" type="tv" />
				</>
			)}
		</div>
	);
};

export default HomeScreen;
