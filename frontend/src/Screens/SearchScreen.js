import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Col, Row, Spin, Select, Card } from 'antd';
import { Link } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;

const SearchScreen = () => {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [type, setType] = useState('movie');

	const handleSubmit = (q) => {
		setResults([]);
		setQuery(q);
	};

	const handleSelect = (value) => {
		setType(value);
	};

	useEffect(() => {
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
						setResults(response.data.Search);
						console.log(response.data.Search);
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
			<div style={{ display: 'flex', alignItems: 'end' }}>
				<Select defaultValue="movie" onChange={handleSelect} style={{ marginRight: '10px' }}>
					<Option value="movie">Movies</Option>
					<Option value="series">Series</Option>
				</Select>
				<Search
					autoFocus
					placeholder="input search text"
					onSearch={(q) => handleSubmit(q)}
					enterButton
				/>
			</div>
			{isLoading && <Spin size="large" />}
			<Row gutter={[24, 24]}>
				{results &&
					results.map((result) => (
						<Col className="row-gutter" span={{ sm: 24, md: 12, lg: 8 }} key={result.imdbID}>
							<Link to={`/${type}/${result.imdbID}`}>
								<Card
									hoverable
									style={{ width: '100%' }}
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
