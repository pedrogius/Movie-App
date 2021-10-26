import React, { useState, useContext, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import SwiperCore, { Navigation, Autoplay } from 'swiper';
import { useHistory, Link } from 'react-router-dom';
import { StarFilled, CheckCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import TrailerModal from './TrailerModal';
import { Tooltip, notification } from 'antd';
import { AuthContext } from '../Context/AuthContext';
import { addToWatchList, db } from '../Firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

SwiperCore.use([Navigation, Autoplay]);

const Carousel = ({ title, data }) => {
	const [watchList, setWatchList] = useState(null);
	const { user } = useContext(AuthContext);

	const handleAddToWatchList = async (item, e) => {
		console.log(user);
		e.stopPropagation();
		if (user) {
			const method = watchList.includes(item.id) ? 'remove' : 'add';
			try {
				await addToWatchList(method, user.uid, item);
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
						Please <Link to="/login">login</Link> or
						<Link to="/register">create an account</Link> to keep a watchlist
					</div>
				),
				placement: 'bottomRight',
			});
		}
	};

	useEffect(() => {
		if (user) {
			const q = query(collection(db, 'users', user.uid, 'watchList'));
			const unsub = onSnapshot(q, (querySnapshot) => {
				const list = [];
				querySnapshot.forEach((doc) => {
					list.push(doc.data().id);
				});
				setWatchList(list);
			});
			return () => unsub();
		}
	}, [user]);

	const history = useHistory();
	return (
		<div className="custom-slider">
			<h2>{title}</h2>
			<Swiper
				slidesPerView={'auto'}
				spaceBetween={10}
				slidesPerGroup={2}
				grabCursor
				loop
				loopedSlides={50}
				navigation={{
					clickable: true,
				}}
				className="mySwiper"
				autoplay={{
					delay: 2500,
					pauseOnMouseEnter: true,
				}}
			>
				{data.map((item) => {
					return (
						<SwiperSlide
							key={item.id}
							style={{ listStyle: 'none' }}
							onClick={() => history.push(`/movie/${item.id}`)}
						>
							<div className="slide">
								<Tooltip
									title={
										watchList?.includes(item.id) ? 'Remove From Watchlist' : 'Add To Watchlist'
									}
								>
									<div
										className={`ribbon ${watchList?.includes(item.id) ? 'on-watchlist' : null}`}
										onClick={(e) => handleAddToWatchList(item, e)}
									>
										{watchList?.includes(item.id) ? (
											<CheckCircleOutlined />
										) : (
											<PlusCircleOutlined />
										)}
									</div>
								</Tooltip>
								<img
									className="slide-img"
									src={item.image}
									style={{ height: '100%', width: '100%' }}
									alt={item.title}
								/>
								<div className="slide-content">
									<h3 className="slide-title">
										{item.title} ({item.year})
									</h3>
									<div className="slide-info">
										<div className="tomato">
											<img src="/tomatometer.svg" height="16px" alt="" />
											<strong className="score">{item.tomatoMeter}%</strong>
										</div>
										<div className="imdb">
											<StarFilled style={{ fontSize: '16px', color: 'hsla(50, 100%, 50%, 1)' }} />
											<strong className="score">{item.imdbScore}</strong>
										</div>
										{item.trailer && (
											<div className="trailer">
												<TrailerModal id={item.trailer} />
											</div>
										)}
									</div>
								</div>
							</div>
						</SwiperSlide>
					);
				})}
			</Swiper>
		</div>
	);
};

export default Carousel;
