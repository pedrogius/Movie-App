import { Col, Row, Result, Button } from 'antd';
import React from 'react';

const ErrorScreen = ({ error }) => {
	return (
		<Row justify="center">
			<Col span={8}>
				<Result
					status="500"
					title="500"
					subTitle="Sorry, something went wrong."
					extra={<Button type="primary">Back Home</Button>}
				/>
				<p>{error.message}</p>
			</Col>
		</Row>
	);
};

export default ErrorScreen;
