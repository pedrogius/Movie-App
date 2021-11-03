import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Row, Card, Image } from 'antd';
import { Link, useRouteMatch } from 'react-router-dom';
import Recommended from '../Components/Recommended';
import SkeletonList from '../Components/SkeletonList';

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
				url: 'https://www.omdbapi.com/',
				params: {
					apikey: process.env.REACT_APP_OMDB_KEY,
					s: value,
					type,
				},
			};
			setIsLoading(true);
			axios
				.request(options)
				.then((response) => {
					if (mounted) {
						const data = response.data.Search;
						const uniqueResults = Array.from(new Set(data.map((a) => a.imdbID))).map((id) => {
							return data.find((a) => a.imdbID === id);
						});
						setResults(uniqueResults);
						setIsLoading(false);
					}
				})
				.catch((error) => {
					setIsLoading(false);
					throw new Error(error);
				});
		};
		search(query);
		return () => {
			mounted = false;
		};
	}, [query, type]);

	return (
		<>
			<Row gutter={[24, 24]}>
				<Col span={18}>
					{isLoading && <SkeletonList />}
					<div className="search-card-container">
						{results &&
							results.map((result) => (
								<Link to={`/${type}/${result.imdbID}`}>
									<div className="search-card" key={result.imdbID}>
										<img src={result.Poster} alt={result.Title} />
										<div className="search-card-content">
											<h3 className="search-card-text">
												{result.Title} ({result.Year})
											</h3>
										</div>
									</div>
								</Link>
							))}
					</div>
				</Col>
				<Col span={6}>
					<Recommended type={type} />
				</Col>
			</Row>
		</>
	);
};

export default SearchScreen;
