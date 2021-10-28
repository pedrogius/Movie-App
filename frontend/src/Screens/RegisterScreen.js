import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Input, notification, Spin, Row } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { register, signInWithGoogle } from '../Firebase';
import { AuthContext } from '../Context/AuthContext';
import { parseFirebaseError } from '../Utils';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const RegisterScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [formStatus, setFormStatus] = useState('');
	const [disabled, setDisabled] = useState(false);
	const history = useHistory();

	const { user } = useContext(AuthContext);

	useEffect(() => {
		if (user) {
			history.replace('/dashboard');
		}
	}, [user, history]);

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	const signUp = async () => {
		try {
			setIsLoading(true);
			setFormStatus('validating');
			setDisabled(true);
			await register(email, password);
			setIsLoading(false);
			setFormStatus('success');
			notification.success({
				message: 'Registration Successful!',
				description: 'Welcome to Flixar',
				placement: 'bottomRight',
			});
		} catch (e) {
			setIsLoading(false);
			setDisabled(false);
			setFormStatus('error');
			const { type, message } = parseFirebaseError(e);
			if (type === 'auth') {
				notification.error({
					message: 'Registration Failed',
					description: message,
					placement: 'bottomRight',
				});
			} else {
				notification.error({
					message: 'Registration Failed',
					description: 'Something Went Wrong',
					placement: 'bottomRight',
				});
			}
		}
	};

	return (
		<Row justify="center">
			<div className="login-card">
				<h2>Welcome</h2>
				<h4>Register Your Flixar Account</h4>
				<Form
					name="basic"
					initialValues={{
						remember: true,
					}}
					onFinish={signUp}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
				>
					<Form.Item
						name="email"
						rules={[
							{
								required: true,
								message: 'Please input your email!',
							},
						]}
						validateStatus={formStatus}
					>
						<Input
							prefix={<UserOutlined />}
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</Form.Item>

					<Form.Item
						name="password"
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
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Form.Item>
					<Form.Item
						name="confirm"
						dependencies={['password']}
						hasFeedback
						rules={[
							{
								required: true,
								message: 'Please confirm your password!',
							},
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue('password') === value) {
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
						<Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
					</Form.Item>

					<Form.Item>
						<Button disabled={disabled} type="primary" htmlType="submit">
							{isLoading ? <Spin>Sign Up</Spin> : 'Sign Up'}
						</Button>
					</Form.Item>
				</Form>
				<Button onClick={signInWithGoogle}>Login with Google</Button>
				<div>
					Already have an account? <Link to="/login">Login</Link> now.
				</div>
			</div>
		</Row>
	);
};

export default RegisterScreen;
