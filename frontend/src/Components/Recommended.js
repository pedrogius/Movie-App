import React, { useState, useEffect } from 'react';
import { Tabs, List, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { fetchRecommended } from '../Firebase';

const Recommended = ({ type }) => {
	const [recommendedList, setRecommendedList] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [recommendedType, setRecommendedType] = useState(type);

	const { TabPane } = Tabs;

	useEffect(() => {
		const fetchAsync = async () => {
			setIsLoading(true);
			const res = await fetchRecommended(recommendedType || type);
			setRecommendedList(res);
			setIsLoading(false);
		};
		fetchAsync();
	}, [recommendedType, type]);

	return (
		<div className="recommended">
			{recommendedList ? (
				<Tabs
					defaultActiveKey={type}
					centered
					tabBarStyle={{ width: '100%', textAlign: 'center' }}
					onChange={(activeKey) => setRecommendedType(activeKey)}
				>
					<TabPane tab="Movies" key="movie">
						{isLoading ? (
							<div className="centered-spinner">
								<Spin />
							</div>
						) : (
							<List
								dataSource={recommendedList}
								footer={<div>View All</div>}
								renderItem={(item) => (
									<Link to={`/movie/${item.id}`}>
										<List.Item style={{ justifyContent: 'flex-start', padding: '5px 0' }}>
											<span className="recommended-score">{item.tmdbScore}</span>
											<span className="recommended-title">{item.title}</span>
										</List.Item>
									</Link>
								)}
							/>
						)}
					</TabPane>
					<TabPane tab="Series" key="tv">
						{isLoading ? (
							<div className="centered-spinner">
								<Spin />
							</div>
						) : (
							<List
								dataSource={recommendedList}
								footer={<div>View All</div>}
								renderItem={(item) => (
									<Link to={`/tv/${item.id}`}>
										<List.Item>
											<span className="recommended-score">{item.tmdbScore}</span>
											{item.title}
										</List.Item>
									</Link>
								)}
							/>
						)}
					</TabPane>
				</Tabs>
			) : (
				<Spin />
			)}
		</div>
	);
};

export default Recommended;
