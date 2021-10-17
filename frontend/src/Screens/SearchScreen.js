import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Row, Spin, Card } from 'antd';
import { Link, useRouteMatch } from 'react-router-dom';

const SearchScreen = () => {
	const [results, setResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [type, setType] = useState('movie');
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
		<div className="site-layout-content">
			{isLoading && <Spin size="large" />}
			<Row gutter={[24, 24]}>
				{results &&
					results.map((result) => (
						<Col span={{ sm: 24, md: 12, lg: 8 }} key={result.imdbID}>
							<Link to={`/${type}/${result.imdbID}`}>
								<Card
									hoverable
									style={{ width: '90%' }}
									cover={<img src={result.Poster} alt={result.Title} />}
								>
									{result.Title} ({result.Year})
								</Card>
							</Link>
						</Col>
					))}
			</Row>
		</div>
	);
};

export default SearchScreen;
