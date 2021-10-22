import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import SwiperCore, { Navigation, Autoplay } from 'swiper';
import { useHistory } from 'react-router-dom';
import { StarFilled } from '@ant-design/icons';
import TrailerModal from './TrailerModal';

SwiperCore.use([Navigation, Autoplay]);

const Carousel = ({ title, data }) => {
	const history = useHistory();
	return (
		<div className="custom-slider">
			<h2>Recommended</h2>
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
											<StarFilled style={{ fontSize: '16px', color: 'yellow' }} />
											<strong className="score">{item.imdbScore}</strong>
										</div>
										<div className="trailer">
											<TrailerModal id={item.trailer} />
										</div>
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
