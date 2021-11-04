import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Col, Divider, Row } from 'antd';
import { Link, useRouteMatch } from 'react-router-dom';
import Recommended from '../Components/Recommended';
import SkeletonList from '../Components/SkeletonList';
import { genreIDsToName } from '../Utils';

const SearchScreen = () => {
	const [results, setResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [type, setType] = useState(null);
	const [query, setQuery] = useState('');

	const match = useRouteMatch('/search/:searchType/:searchTerm');

	useEffect(() => {
		if (match) {
			const { searchTerm, searchType } = match.params;
			setType(searchType);
			setQuery(searchTerm);
		}
	}, [match]);

	useEffect(() => {
		setResults([]);
		let mounted = true;
		const search = (value) => {
			const options = {
				method: 'GET',
				url: `https://api.themoviedb.org/3/search/movie`,
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
							return result.poster_path && result.popularity > 25;
						});
						console.log(filteredResults);
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
												alt={result.title}
											/>
										</Link>
										<div className="result-description">
											<div className="result-title">
												<Link to={`/${type}/${result.id}`}>
													<h2>
														{result.title} ({result.release_date.split('-')[0]})
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
											<p>{result.overview}</p>
											<div className="result-buttons" style={{}}>
												<Link to={`/${type}/${result.id}`}>
													<Button type="primary">Streaming Availability</Button>
												</Link>
												<Button>Add to Watchlist</Button>
												<Button>Mark As Seen</Button>
											</div>
										</div>
									</div>
									<Divider style={{ marginTop: '0px', marginBottom: '0px' }} />
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
