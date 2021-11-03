import React from 'react';
import { Skeleton } from 'antd';

const SkeletonList = () => {
	return (
		<div className="search-card-container">
			<div className="search-card">
				<Skeleton active />
			</div>
			<div className="search-card">
				<Skeleton active />
			</div>
			<div className="search-card">
				<Skeleton active />
			</div>
			<div className="search-card">
				<Skeleton active />
			</div>
			<div className="search-card">
				<Skeleton active />
			</div>
			<div className="search-card">
				<Skeleton active />
			</div>
		</div>
	);
};

export default SkeletonList;
