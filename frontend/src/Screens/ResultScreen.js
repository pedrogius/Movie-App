import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Skeleton, Row, Col, Tabs, Button, Image, Divider, Tag, List } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { CountryContext } from '../Context/CountryContext';
import { AuthContext } from '../Context/AuthContext';
import { fetchFromDB, addToRecommended, checkRecommended, fetchRecommended } from '../Firebase';
import { minutesToHoursAndMinutes, makeString, capitalize, isEmpty } from '../Utils';

const ResultScreen = ({ match }) => {
	const [data, setData] = useState(null);
	const [isRecommended, setIsRecommended] = useState(false);
	const [recommendedList, setRecommendedList] = useState(null);
	const { id, type } = match.params;
	const [recommendedType, setRecommendedType] = useState(type);

	const { country } = useContext(CountryContext);
	const { isAdmin } = useContext(AuthContext);
	const { TabPane } = Tabs;

	useEffect(() => {
		const fetchAsync = async () => {
			const res = await fetchRecommended(recommendedType);
			setRecommendedList(res);
		};
		fetchAsync();
	}, [recommendedType, isRecommended]);

	useEffect(() => {
		const fetchData = async (id) => {
			try {
				const res = await fetchFromDB(id, type, country);
				setData(res);
			} catch (e) {
				console.log(e);
			}
		};
		fetchData(id);
	}, [id, type, country]);

	useEffect(() => {
		if (isAdmin) {
			const func = async () => {
				const res = await checkRecommended(id, type);
				setIsRecommended(res);
			};
			func();
		}
	}, [isAdmin, id, type]);

	const handleAddToRecommended = async () => {
		await addToRecommended(id, type, !isRecommended);
		setIsRecommended(!isRecommended);
	};

	const isAvailable = (obj) => {
		if (!isEmpty(obj)) {
			const results = [];
			for (let stream in obj) {
				if (Object.keys(obj[stream]).includes(country.toLowerCase())) {
					results.push(stream);
				}
			}
			return results;
		}
	};

	return (
		<div className="site-layout-content">
			{data ? (
				<Row gutter={32} className="main-row">
					<Col span={18}>
						<Row className="top-inner-row">
							<Col span={24}>
								<h1 style={{ marginBottom: '0px' }}>
									{data.originalTitle} ({data.year}
									{data.lastAirYear && ` - ${data.lastAirYear}`})
								</h1>
								<p>
									{data.seasons && `${data.seasons} seasons - ${data.episodes} episodes - `}
									{minutesToHoursAndMinutes(data.runtime || data.episodeRuntimes)}
								</p>
							</Col>
						</Row>
						<Row gutter={32} className="inner-row">
							<Col className="poster-col" span={8}>
								<Image preview={false} src={data.posterURLs[500]} className="poster" />
							</Col>
							<Col span={16}>
								<p>{data.overview}</p>
								<Divider />
								<p>
									<strong>{type === 'series' ? 'Created by  ' : 'Directed by  '}</strong>
									{makeString(data.significants)}
								</p>
								<Divider />
								<p>
									<strong>Stars </strong>
									{makeString(data.cast)}
								</p>
								<Divider />
								<p>
									<strong style={{ marginRight: '12px' }}>Streaming</strong>
									{isAvailable(data.streamingInfo) ? (
										isAvailable(data.streamingInfo).map((stream) => (
											<Tag key={stream} color="success" icon={<CheckCircleOutlined />}>
												{capitalize(stream)}
											</Tag>
										))
									) : (
										<Tag color="error" icon={<CloseCircleOutlined />}>
											Not Available
										</Tag>
									)}
								</p>
								{isAdmin && (
									<>
										<Divider />
										<Button onClick={handleAddToRecommended}>
											{isRecommended ? 'Remove from Recommended' : 'Add to Recommended'}
										</Button>
									</>
								)}
							</Col>
						</Row>
					</Col>
					<Col span={6}>
						<h2>What to Watch</h2>
						<div className="recommended">
							<Tabs
								defaultActiveKey={recommendedType}
								centered
								tabBarStyle={{ width: '100%', textAlign: 'center' }}
								onChange={(activeKey) => setRecommendedType(activeKey)}
							>
								{console.log(recommendedList)}
								<TabPane tab="Movies" key="movie">
									<List
										dataSource={recommendedList}
										footer={<div>View All</div>}
										renderItem={(item) => (
											<Link to={`/movie/${item.id}`}>
												<List.Item>{item.title}</List.Item>
											</Link>
										)}
									/>
								</TabPane>
								<TabPane tab="Series" key="series">
									<List
										dataSource={recommendedList}
										footer={<div>View All</div>}
										renderItem={(item) => (
											<Link to={`/series/${item.id}`}>
												<List.Item>{item.title}</List.Item>
											</Link>
										)}
									/>
								</TabPane>
							</Tabs>
						</div>
					</Col>
				</Row>
			) : (
				<Skeleton active />
			)}
		</div>
	);
};

ResultScreen.propTypes = {
	match: PropTypes.object,
};

export default ResultScreen;
