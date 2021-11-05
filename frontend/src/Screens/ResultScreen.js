import React, { useState, useEffect, useContext } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Skeleton, Row, Col, Button, Image, Divider, Tag, Spin, notification } from 'antd';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	MinusCircleOutlined,
	PlusCircleOutlined,
	StarFilled,
} from '@ant-design/icons';
import { CountryContext } from '../Context/CountryContext';
import { AuthContext } from '../Context/AuthContext';
import {
	fetchFromDB,
	addToRecommended,
	checkRecommended,
	makeOriginal,
	fetchTomatoMeter,
	checkWatchList,
	addToWatchList,
} from '../Firebase';
import { minutesToHoursAndMinutes, makeString, isEmpty, formatStream } from '../Utils/Utils';
import Recommended from '../Components/Recommended';
import TrailerModal from '../Components/TrailerModal';
import ReadMore from '../Components/ReadMore';

const ResultScreen = () => {
	const match = useRouteMatch('/:type/:id');
	const history = useHistory();

	const [data, setData] = useState(null);
	const [isRecommended, setIsRecommended] = useState(false);
	const [isOnWatchList, setIsOnWatchList] = useState(false);
	const [isOriginal, setIsOriginal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isWatchListLoading, setIsWatchListLoading] = useState(false);
	const { type, id } = match.params;

	const { country } = useContext(CountryContext);
	const { user, isAdmin } = useContext(AuthContext);

	useEffect(() => {
		setIsLoading(true);
	}, [country]);

	useEffect(() => {
		let mounted = true;
		if (user && mounted) {
			checkWatchList(user.uid, id)
				.then((res) => setIsOnWatchList(res))
				.catch((e) => console.log(e));
		}
		return () => {
			mounted = false;
		};
	}, [id, user]);

	useEffect(() => {
		const fetchData = async (id) => {
			try {
				const res = await fetchFromDB(id, type, country);
				setData(res);
				setIsLoading(false);
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

	const handleAddToWatchList = async () => {
		if (user) {
			const item = {
				title: data.title,
				id: data.imdbID,
				year: data.year,
				poster: data.posterURLs[92],
			};
			const method = isOnWatchList ? 'remove' : 'add';
			try {
				setIsWatchListLoading(true);
				await addToWatchList(method, user.uid, item);
				setIsOnWatchList(!isOnWatchList);
				notification.success({
					message: method === 'add' ? 'Added!' : 'Removed!',
					description: `${data.title} is ${
						method === 'add' ? 'now on' : 'no longer on'
					} your watchlist.`,
					placement: 'bottomRight',
				});
			} catch (error) {
				notification.error({
					message: 'Error',
					description: 'Something Went Wrong',
					placement: 'bottomRight',
				});
			}
		} else {
			notification.warning({
				message: 'Account Required',
				description: (
					<div>
						Please{' '}
						<strong className="notification-link" onClick={() => history.push('/login')}>
							login
						</strong>{' '}
						or
						<strong className="notification-link" onClick={() => history.push('/register')}>
							{' '}
							create an account
						</strong>{' '}
						to keep a watchlist
					</div>
				),
				placement: 'bottomRight',
			});
		}
		setIsWatchListLoading(false);
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
		<>
			{data ? (
				<Row gutter={32} className="main-row">
					<Col span={18}>
						<Row className="top-inner-row">
							<Col span={8}>
								<h1 style={{ marginBottom: '0px' }}>
									{data.title} ({data.year}
									{data.lastAirYear && data.year !== data.lastAirYear && ` - ${data.lastAirYear}`})
								</h1>
								<p id="result-length">
									{data.seasons &&
										`${data.seasons} ${data.seasons > 1 ? 'seasons' : 'season'} - ${
											data.episodes
										} episodes - `}
									{minutesToHoursAndMinutes(data.runtime || data.episodeRuntimes[0])}
								</p>
							</Col>
							<Col span={16}>
								<div className="result-ratings">
									<TrailerModal id={data.video} />

									{isOnWatchList ? (
										<Button disabled={isWatchListLoading} onClick={handleAddToWatchList}>
											<MinusCircleOutlined /> Remove from Watchlist
										</Button>
									) : (
										<Button disabled={isWatchListLoading} onClick={handleAddToWatchList}>
											<PlusCircleOutlined /> Add to Watchlist
										</Button>
									)}

									<div className="imdb">
										<StarFilled style={{ fontSize: '16px', color: 'hsla(50, 100%, 50%, 1)' }} />
										<strong className="score"> {data.imdbRating}</strong>
									</div>

									<div className="tomato">
										<img src="/tomatometer.svg" height="16px" alt="tomatoMeter" />
										<strong className="score"> {data.tomatoMeter}%</strong>
									</div>
								</div>
							</Col>
						</Row>
						<Row gutter={32} className="inner-row">
							<Col span={8}>
								<Image preview={false} src={data.posterURLs[500]} className="poster" />
							</Col>
							<Col span={16}>
								<Divider orientation="left" style={{ marginTop: 0 }}>
									<strong>Overview</strong>
								</Divider>
								<ReadMore>{data.overview}</ReadMore>
								<Divider orientation="left">
									<strong>{type === 'tv' ? 'Created by  ' : 'Directed by  '}</strong>
								</Divider>
								<p>{makeString(data.significants)}</p>
								<Divider orientation="left">
									<strong>Stars</strong>
								</Divider>
								<p>{makeString(data.cast)}</p>
								<Divider orientation="left">
									<strong>Streaming</strong>
								</Divider>
								<div>
									{isLoading ? (
										<Spin />
									) : isAvailable(data.streamingInfo) ? (
										isAvailable(data.streamingInfo).map((stream) => (
											<Tag key={stream} color="success" icon={<CheckCircleOutlined />}>
												{formatStream(stream)}
											</Tag>
										))
									) : (
										<Tag color="error" icon={<CloseCircleOutlined />}>
											Not Available
										</Tag>
									)}
								</div>
								{isAdmin && (
									<>
										<Divider />
										<div className="admin-buttons">
											<Button onClick={handleAddToRecommended}>
												{isRecommended ? 'Remove from Recommended' : 'Add to Recommended'}
											</Button>
											<Button onClick={handleMakeOriginal}>
												{isOriginal ? 'Remove from Originals' : 'Add to Originals'}
											</Button>
											<Button onClick={handleTomatoScore}>Fetch TomatoMeter</Button>
										</div>
									</>
								)}
							</Col>
						</Row>
					</Col>
					<Col span={6}>
						<h2 style={{ textAlign: 'center' }}>What to Watch</h2>
						<Recommended type={type} />
					</Col>
				</Row>
			) : (
				<Skeleton active />
			)}
		</>
	);
};

ResultScreen.propTypes = {
	match: PropTypes.object,
};

export default ResultScreen;
