import React, { useState, useEffect } from 'react';
import { fetchRecommended } from '../Firebase';
import Carousel from '../Components/Carousel';
import { Skeleton } from 'antd';

const HomeScreen = () => {
	const [recommendedMovies, setRecommendedMovies] = useState(null);
	const [recommendedSeries, setRecommendedSeries] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchAsync = async () => {
			setIsLoading(true);
			const movieRes = await fetchRecommended('movie');
			const seriesRes = await fetchRecommended('series');
			setRecommendedMovies(movieRes);
			setRecommendedSeries(seriesRes);
			setIsLoading(false);
		};
		fetchAsync();
	}, []);

	return (
		<div>
			{isLoading ? (
				<Skeleton active />
			) : (
				<>
					<Carousel data={recommendedMovies} title="Recommended Movies" />
					<Carousel data={recommendedSeries} title="Recommended Series" />
				</>
			)}
		</div>
	);
};

export default HomeScreen;
