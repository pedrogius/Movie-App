import React, { useContext, useState, useEffect } from 'react';
import { Button, Row, Form, Input, Select, notification, Spin, Tabs, Skeleton, Alert } from 'antd';
import { AuthContext } from '../Context/AuthContext';
import { CountryContext } from '../Context/CountryContext';
import { updateUserProfile, updateUserPassword, logout, db } from '../Firebase';
import { parseFirebaseError } from '../Utils';
import { LockOutlined } from '@ant-design/icons';
import { doc, onSnapshot } from 'firebase/firestore';

const DashboardScreen = () => {
	const [userDataFromDB, setUserDataFromDB] = useState(null);
	const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
	const [selectedGenres, setSelectedGenres] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [name, setName] = useState('');
	const [selectedCountry, setSelectedCountry] = useState('');
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [formStatus, setFormStatus] = useState();
	const [showAlert, setShowAlert] = useState(false);
	const { user } = useContext(AuthContext);
	const { country } = useContext(CountryContext);

	const [form] = Form.useForm();

	const { TabPane } = Tabs;

	useEffect(() => {
		const unsub = onSnapshot(doc(db, 'users', user.uid), (doc) => {
			const data = doc.data();
			setUserDataFromDB(data);
			if (!data.genres || !data.subscriptions) {
				setShowAlert(true);
			}
		});
		return () => {
			unsub();
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
				description: 'Your Profile Was Successfully Updated',
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

	const handleNewPasswordSubmit = async () => {
		try {
			setIsLoading(true);
			setFormStatus('validating');
			await updateUserPassword(user.email, oldPassword, newPassword);
			notification.success({
				message: 'Password Updated!',
				description: 'Your Password Was Successfully Updated',
				placement: 'bottomRight',
			});
			setFormStatus('');
			form.resetFields();
		} catch (e) {
			setFormStatus('error');
			const { message } = parseFirebaseError(e);
			notification.error({
				message: 'Password Update Failed',
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
				<Tabs defaultActiveKey={1} centered>
					<TabPane tab="Profile" key="1">
						{showAlert && (
							<div className="dashboard-alert">
								<Alert
									closable
									type="info"
									message="Complete Your Profile"
									description="To get personalized content, please fill out the forms below"
									showIcon
								/>
							</div>
						)}
						{userDataFromDB ? (
							<Form name="profile" layout="vertical" onFinish={handleSubmit}>
								<Form.Item name="email" label="Email" initialValue={userDataFromDB.email}>
									<Input type="email" disabled />
								</Form.Item>
								<Form.Item name="name" label="Name" initialValue={userDataFromDB.name || ''}>
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
								<Form.Item
									name="genres"
									label="Favorite Genres"
									initialValue={userDataFromDB.genres}
								>
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
						) : (
							<Skeleton active />
						)}
					</TabPane>
					<TabPane tab="Password" key="2">
						<h2>Update Password</h2>
						<Form
							form={form}
							name="password-change"
							layout="vertical"
							onFinish={handleNewPasswordSubmit}
						>
							<Form.Item
								name="oldPassword"
								rules={[
									{
										required: true,
										message: 'Please input your old password!',
									},
								]}
								hasFeedback
								validateStatus={formStatus}
							>
								<Input.Password
									prefix={<LockOutlined />}
									placeholder="Old Password"
									value={oldPassword}
									onChange={(e) => setOldPassword(e.target.value)}
								/>
							</Form.Item>
							<Form.Item
								name="newPassword"
								rules={[
									{
										required: true,
										message: 'Please input your password!',
									},
								]}
								hasFeedback
								validateStatus={formStatus}
							>
								<Input.Password
									prefix={<LockOutlined />}
									placeholder="New Password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
								/>
							</Form.Item>
							<Form.Item
								name="confirm"
								dependencies={['newPassword']}
								hasFeedback
								rules={[
									{
										required: true,
										message: 'Please confirm your password!',
									},
									({ getFieldValue }) => ({
										validator(_, value) {
											if (!value || getFieldValue('newPassword') === value) {
												setFormStatus('success');
												return Promise.resolve();
											}
											setFormStatus('error');
											return Promise.reject(
												new Error('The two passwords that you entered do not match!')
											);
										},
									}),
								]}
								validateStatus={formStatus}
							>
								<Input.Password prefix={<LockOutlined />} placeholder="Confirm New Password" />
							</Form.Item>
							<Form.Item>
								<Button disabled={isLoading} type="primary" htmlType="submit">
									{isLoading ? <Spin>Update Password</Spin> : 'Update Password'}
								</Button>
							</Form.Item>
						</Form>
						<Button onClick={logout}>Logout</Button>
					</TabPane>
				</Tabs>
			</div>
		</Row>
	);
};

export default DashboardScreen;
