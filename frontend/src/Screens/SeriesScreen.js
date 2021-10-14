import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Skeleton, Row, Col, Card, Table, Button } from 'antd';
import { CountryContext } from '../Context/CountryContext';
import { AuthContext } from '../Context/AuthContext';
import { fetchFromDB, addToRecommended, checkRecommended } from '../Firebase';

const SeriesScreen = ({ match }) => {
	const [data, setData] = useState(null);
	const [tableData, setTableData] = useState(null);
	const [isRecommended, setIsRecommended] = useState(false);
	const { id, type } = match.params;

	const { country } = useContext(CountryContext);
	const { isAdmin } = useContext(AuthContext);

	useEffect(() => {
		const fetchData = async (id) => {
			try {
				const data = await fetchFromDB(id, type, country);
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
					},
				];
				setData(data);
				setTableData(parsedData);
			} catch (e) {
				console.log(e);
			}
		};
		fetchData(id);
	}, [id, type, country]);

	useEffect(() => {
		if (isAdmin) {
			const func = async () => {
				const res = await checkRecommended(id);
				setIsRecommended(res);
			};
			func();
		}
	}, [isAdmin, id]);

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

	const handleRemoveRecommended = async () => {
		setIsRecommended(false);
	};

	const handleAddToRecommended = async () => {
		await addToRecommended(id, type);
		setIsRecommended(true);
	};

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
								{type === 'movie' ? data.year : `${data.year} - ${data.lastAirYear}`})
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
							{isAdmin &&
								(isRecommended ? (
									<Button type="danger" onClick={handleRemoveRecommended}>
										Remove from recommended
									</Button>
								) : (
									<Button type="primary" onClick={handleAddToRecommended}>
										Add to recommended
									</Button>
								))}
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
