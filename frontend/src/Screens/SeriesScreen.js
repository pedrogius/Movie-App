import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Skeleton, Row, Col, Card, Table } from 'antd';
import { CountryContext } from '../Context/CountryContext';

const SeriesScreen = ({ match }) => {
	const [data, setData] = useState(null);
	const [tableData, setTableData] = useState(null);
	const { id, type } = match.params;
	const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

	const { country } = useContext(CountryContext);

	useEffect(() => {
		const fetchData = async (id) => {
			const options = {
				method: 'GET',
				url: 'https://streaming-availability.p.rapidapi.com/get/basic',
				params: { country, imdb_id: id },
				headers: {
					'x-rapidapi-host': 'streaming-availability.p.rapidapi.com',
					'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
				},
			};
			try {
				const { data } = await axios.request(options);
				const parsedData = [
					{
						key: 1,
						property: 'Overview',
						value: data.overview,
					},
					{
						key: 2,
						property: 'Country',
						value: data.countries.join(', '),
					},
					{
						key: 3,
						property: type === 'movie' ? 'Director' : 'Seasons',
						value: type === 'movie' ? data.significants : data.seasons,
					},
					{
						key: 4,
						property: 'Cast',
						value: data.cast.join(', '),
					},
					{
						key: 5,
						property: 'Streaming Availability',
						value: capitalize(Object.keys(data.streamingInfo).toString()) || 'Not Available',
					},
				];
				setTableData(parsedData);
				setData(data);
			} catch (e) {
				console.log(e);
			}
		};
		fetchData(id);
	}, [id, type, country]);

	const columns = [
		{
			width: '25%',
			dataIndex: 'property',
			key: 'property',
		},
		{
			dataIndex: 'value',
			key: 'value',
		},
	];

	return (
		<div className="site-layout-content">
			{data ? (
				<div>
					<Row gutter={32} justify="center" align="middle">
						<Col span={6}>
							<img
								src={data.posterURLs[500]}
								style={{ maxWidth: '100%' }}
								alt={data.originalTitle}
							/>
						</Col>
						<Col span={14}>
							<h1>
								{data.originalTitle} (
								{type === 'movie' ? data.year : `${data.firstAirYear} - ${data.lastAirYear}`})
							</h1>
							<Table
								columns={columns}
								dataSource={tableData}
								pagination={false}
								showHeader={false}
							/>
						</Col>
						<Col span={4}>
							<Card
								title="Score"
								bordered="false"
								style={{ width: 100, backgroundColor: 'green', textAlign: 'center' }}
							>
								<p>{data.imdbRating}</p>
							</Card>
						</Col>
					</Row>
				</div>
			) : (
				<Skeleton active />
			)}
		</div>
	);
};

SeriesScreen.propTypes = {
	match: PropTypes.object,
};

export default SeriesScreen;
