import React, { useState, useEffect } from 'react';
import { Tabs, List, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { fetchRecommended } from '../Firebase';

const Recommended = ({ type }) => {
	const [recommendedList, setRecommendedList] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [recommendedType, setRecommendedType] = useState('movie');

	const { TabPane } = Tabs;

	useEffect(() => {
		const fetchAsync = async () => {
			setIsLoading(true);
			const res = await fetchRecommended(recommendedType);
			setRecommendedList(res);
			setIsLoading(false);
		};
		fetchAsync();
	}, [recommendedType]);

	return (
		<div className="recommended">
			{recommendedList ? (
				<Tabs
					defaultActiveKey={recommendedType}
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
										<List.Item>{item.title}</List.Item>
									</Link>
								)}
							/>
						)}
					</TabPane>
					<TabPane tab="Series" key="series">
						{isLoading ? (
							<div className="centered-spinner">
								<Spin />
							</div>
						) : (
							<List
								dataSource={recommendedList}
								footer={<div>View All</div>}
								renderItem={(item) => (
									<Link to={`/series/${item.id}`}>
										<List.Item>{item.title}</List.Item>
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
