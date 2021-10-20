import React, { useState, useEffect, useContext } from 'react';
import { useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Skeleton, Row, Col, Button, Image, Divider, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { CountryContext } from '../Context/CountryContext';
import { AuthContext } from '../Context/AuthContext';
import {
	fetchFromDB,
	addToRecommended,
	checkRecommended,
	makeOriginal,
	fetchTomatoMeter,
} from '../Firebase';
import { minutesToHoursAndMinutes, makeString, capitalize, isEmpty } from '../Utils';
import Recommended from '../Components/Recommended';

const ResultScreen = () => {
	const match = useRouteMatch('/:type/:id');

	const [data, setData] = useState(null);
	const [isRecommended, setIsRecommended] = useState(false);
	const [isOriginal, setIsOriginal] = useState(false);
	const { type, id } = match.params;

	const { country } = useContext(CountryContext);
	const { isAdmin } = useContext(AuthContext);

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
				if (res) {
					setIsRecommended(res.recommended);
					setIsOriginal(res.original);
				}
			};
			func();
		}
	}, [isAdmin, id, type]);

	const handleAddToRecommended = async () => {
		await addToRecommended(id, type, !isRecommended);
		setIsRecommended(!isRecommended);
	};

	const handleMakeOriginal = async () => {
		await makeOriginal(id, type, !isOriginal);
		setIsOriginal(!isOriginal);
	};

	const handleTomatoScore = async () => {
		const score = await fetchTomatoMeter(data.title, type, data.year);
		console.log(score);
	};

	const isAvailable = (obj) => {
		if (!isEmpty(obj)) {
			const results = [];
			for (let stream in obj) {
				if (Object.keys(obj[stream]).includes(country.toLowerCase())) {
					results.push(stream);
				}
			}
			return results.length ? results : undefined;
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
									{data.title} ({data.year}
									{data.lastAirYear && data.year !== data.lastAirYear && ` - ${data.lastAirYear}`})
								</h1>
								<p>
									{data.seasons &&
										`${data.seasons} ${data.seasons > 1 ? 'seasons' : 'season'} - ${
											data.episodes
										} episodes - `}
									{minutesToHoursAndMinutes(data.runtime || data.episodeRuntimes[0])}
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
									{console.log(isAvailable(data.streamingInfo))}
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
										<Button onClick={handleAddToRecommended} style={{ marginRight: '10px' }}>
											{isRecommended ? 'Remove from Recommended' : 'Add to Recommended'}
										</Button>
										<Button onClick={handleMakeOriginal}>
											{isOriginal ? 'Remove from Originals' : 'Add to Originals'}
										</Button>
										<Button onClick={handleTomatoScore}>Fetch TomatoMeter</Button>
									</>
								)}
							</Col>
						</Row>
					</Col>
					<Col span={6}>
						<h2>What to Watch</h2>
						<Recommended type={type} />
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
