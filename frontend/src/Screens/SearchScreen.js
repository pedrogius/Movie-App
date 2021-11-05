import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Col, Divider, Row } from 'antd';
import { Link, useRouteMatch } from 'react-router-dom';
import Recommended from '../Components/Recommended';
import SkeletonList from '../Components/SkeletonList';
import ReadMore from '../Components/ReadMore';
import { genreIDsToName } from '../Utils/Genres';

const SearchScreen = ({ match }) => {
	const [results, setResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [type, setType] = useState(match.path.split('/')[2] || 'movie');
	const [query, setQuery] = useState('');

	const routeMatch = useRouteMatch('/search/:searchType/:searchTerm');

	useEffect(() => {
		if (routeMatch) {
			const { searchTerm, searchType } = routeMatch.params;
			setType(searchType);
			setQuery(searchTerm);
		}
	}, [routeMatch]);

	useEffect(() => {
		setResults([]);
		let mounted = true;
		const search = (value) => {
			const options = {
				method: 'GET',
				url: `https://api.themoviedb.org/3/search/${type}`,
				params: {
					api_key: process.env.REACT_APP_TMDB_KEY,
					query: value,
				},
			};
			setIsLoading(true);
			axios
				.request(options)
				.then((response) => {
					if (mounted) {
						const { data } = response;
						const filteredResults = data.results.filter((result) => {
							return result.poster_path && result.popularity > 10 && result.genre_ids.length;
						});
						setResults(filteredResults);
						setIsLoading(false);
					}
				})
				.catch((error) => {
					setIsLoading(false);
					throw new Error(error);
				});
		};
		if (query) {
			search(query);
		}

		return () => {
			mounted = false;
		};
	}, [query, type]);

	return (
		<>
			<Row gutter={[24, 24]}>
				<Col span={18}>
					{isLoading && <SkeletonList />}
					{results.length && (
						<div className="search-results-container">
							{results.map((result) => (
								<div className="result-container" key={result.id}>
									<div className="result">
										<Link to={`/${type}/${result.id}`}>
											<img
												src={`https://image.tmdb.org/t/p/original/${result.poster_path}`}
												alt={type === 'movie' ? result.title : result.name}
											/>
										</Link>
										<div className="result-description">
											<div className="result-title">
												<Link to={`/${type}/${result.id}`}>
													<h2>
														{type === 'movie' ? result.title : result.name} (
														{type === 'movie'
															? result.release_date?.split('-')[0]
															: result.first_air_date?.split('-')[0]}
														)
													</h2>
												</Link>
												<div
													className={`result-score ${
														result.vote_average < 4
															? 'bad'
															: result.vote_average < 7
															? 'regular'
															: 'good'
													}`}
												>
													<strong>{result.vote_average.toFixed(1)}</strong>
												</div>
											</div>
											<h3>{genreIDsToName(result.genre_ids)}</h3>
											<ReadMore>{result.overview}</ReadMore>
											<div className="result-buttons" style={{}}>
												<Link to={`/${type}/${result.id}`}>
													<Button type="primary">Streaming Availability</Button>
												</Link>
												<Button>Add to Watchlist</Button>
												<Button>Mark As Seen</Button>
											</div>
										</div>
									</div>
									<Divider style={{}} />
								</div>
							))}
						</div>
					)}
				</Col>
				<Col span={6}>
					<Recommended type={type} />
				</Col>
			</Row>
		</>
	);
};

export default SearchScreen;
