import React, { useContext, useState, useEffect } from 'react';
import { Button, Row, Form, Input, Select, notification, Spin } from 'antd';
import { logout } from '../Firebase';
import { AuthContext } from '../Context/AuthContext';
import { CountryContext } from '../Context/CountryContext';
import { updateUserProfile, getUserProfile } from '../Firebase';
import { parseFirebaseError } from '../Utils';

const DashboardScreen = () => {
	const [userDataFromDB, setUserDataFromDB] = useState(null);
	const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
	const [selectedGenres, setSelectedGenres] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [name, setName] = useState('');
	const [selectedCountry, setSelectedCountry] = useState('');
	const { user } = useContext(AuthContext);
	const { country } = useContext(CountryContext);

	useEffect(() => {
		let mounted = true;
		if (mounted) {
			getUserProfile(user.uid)
				.then((res) => setUserDataFromDB(res))
				.catch((e) => {
					const { message } = parseFirebaseError(e);
					notification.error({
						message: 'Something Went Wrong',
						description: message,
						placement: 'bottomRight',
					});
				});
		}
		return () => {
			mounted = false;
		};
	}, [user]);

	const genres = [
		'Action',
		'Horror',
		'Sci-Fi',
		'Adventure',
		'Animated',
		'Romance',
		'Comedy',
		'Kids',
	];
	const subscriptions = ['Netflix', 'Disney+', 'Prime', 'HBO Max', 'Peacock', 'Paramount'];
	const filteredSubscriptions = subscriptions.filter((x) => !selectedSubscriptions.includes(x));
	const filteredGenres = genres.filter((x) => !selectedGenres.includes(x));

	const handleSubscriptionChange = (selected) => {
		setSelectedSubscriptions(selected);
	};

	const handleGenresChange = (selected) => {
		setSelectedGenres(selected);
	};

	const handleSubmit = async (values) => {
		try {
			setIsLoading(true);
			await updateUserProfile(user.uid, values);
			notification.success({
				message: 'Profile Update Saved!',
				description: 'Your Profile was Successfully Updated',
				placement: 'bottomRight',
			});
		} catch (e) {
			const { message } = parseFirebaseError(e);
			notification.error({
				message: 'Something Went Wrong',
				description: message,
				placement: 'bottomRight',
			});
		}
		setIsLoading(false);
	};

	const { Option } = Select;
	return (
		<Row justify="center">
			<div className="profile-card">
				<h2>Profile Edit</h2>
				{userDataFromDB && (
					<Form name="profile" layout="vertical" onFinish={handleSubmit}>
						<Form.Item name="email" label="Email" initialValue={userDataFromDB.email}>
							<Input type="email" disabled />
						</Form.Item>
						<Form.Item name="name" label="Name" initialValue={userDataFromDB.displayName || ''}>
							<Input value={name} onChange={(n) => setName(n)} type="text" />
						</Form.Item>
						<Form.Item
							name="country"
							label="Country"
							initialValue={userDataFromDB.country || country}
						>
							<Select value={selectedCountry} onChange={(c) => setSelectedCountry(c)}>
								<Option value="AR">Argentina</Option>
								<Option value="US">United States</Option>
							</Select>
						</Form.Item>
						<Form.Item
							name="subscriptions"
							label="Subscriptions"
							initialValue={userDataFromDB.subscriptions}
						>
							<Select
								mode="multiple"
								value={selectedSubscriptions}
								onChange={handleSubscriptionChange}
							>
								{filteredSubscriptions.map((item) => {
									return (
										<Option key={item} value={item}>
											{item}
										</Option>
									);
								})}
							</Select>
						</Form.Item>
						<Form.Item name="genres" label="Favorite Genres" initialValue={userDataFromDB.genres}>
							<Select mode="multiple" value={selectedGenres} onChange={handleGenresChange}>
								{filteredGenres.map((item) => {
									return (
										<Option key={item} value={item}>
											{item}
										</Option>
									);
								})}
							</Select>
						</Form.Item>
						<Form.Item>
							<Button disabled={isLoading} type="primary" htmlType="submit">
								{isLoading ? <Spin>Save Changes</Spin> : 'Save Changes'}
							</Button>
						</Form.Item>
					</Form>
				)}
			</div>
		</Row>
	);
};

export default DashboardScreen;
