import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Input, Row, Spin, notification } from 'antd';
import { Link, useLocation, Redirect, useHistory } from 'react-router-dom';
import { signIn, signInWithGoogle } from '../Firebase';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { AuthContext } from '../Context/AuthContext';

function LoginScreen() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [formStatus, setFormStatus] = useState('');
	const [disabled, setDisabled] = useState(false);
	const [redirectToReferrer, setRedirectToReferrer] = useState(false);

	const { state } = useLocation();

	const history = useHistory();

	const { user } = useContext(AuthContext);

	useEffect(() => {
		let mounted = true;
		if (user && mounted) {
			history.replace('/dashboard');
		}
		return () => (mounted = false);
	}, [user, history]);

	if (redirectToReferrer === true) {
		return <Redirect to={state?.from || '/'} />;
	}

	const handleSignIn = async () => {
		try {
			setIsLoading(true);
			setDisabled(true);
			setFormStatus('validating');
			await signIn(email, password);
			setFormStatus('success');
			notification.success({
				message: 'Successfully Logged In',
				description: 'Welcome Back!',
				placement: 'bottomRight',
			});
			setIsLoading(false);
			setRedirectToReferrer(true);
		} catch (e) {
			setDisabled(false);
			if (e.message === 'Wrong Password' || 'User Not Found') {
				notification.error({
					message: 'Login Failed',
					description: 'Please Check Your Credentials',
					placement: 'bottomRight',
				});
			} else {
				notification.error({
					message: 'Login Failed',
					description: 'Something Went Wrong',
					placement: 'bottomRight',
				});
			}
			setFormStatus('error');
			setIsLoading(false);
		}
	};

	const handleSignInWithGoogle = async () => {
		try {
			await signInWithGoogle();
			notification.success({
				message: 'Successfully Logged In',
				description: 'Welcome Back!',
				placement: 'bottomRight',
			});
		} catch (e) {
			notification.error({
				message: 'Login Failed',
				description: 'Something Went Wrong',
				top: 100,
			});
		}
	};

	const onFinishFailed = () => {
		setFormStatus('error');
	};

	return (
		<Row justify="center">
			<div className="login-card">
				<h2>Welcome</h2>
				<h4>Login to Flixar</h4>
				<Form
					name="basic"
					initialValues={{
						remember: true,
					}}
					onFinish={handleSignIn}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
				>
					<Form.Item
						name="username"
						rules={[
							{
								required: true,
								message: 'Please input your username!',
							},
						]}
						hasFeedback
						validateStatus={formStatus}
					>
						<Input
							prefix={<UserOutlined />}
							placeholder="Email"
							value={email}
							onChange={(e) => {
								const { value } = e.target;
								if (value > email) {
									setFormStatus('');
								}
								setEmail(value);
							}}
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
							onChange={(e) => {
								const { value } = e.target;
								if (value > password) {
									setFormStatus('');
								}
								setPassword(value);
							}}
						/>
					</Form.Item>
					<Form.Item>
						<Button disabled={disabled} type="primary" htmlType="submit">
							{isLoading ? <Spin>Login</Spin> : 'Login'}
						</Button>
					</Form.Item>
				</Form>
				<Button onClick={handleSignInWithGoogle}>Login with Google</Button>
				<div>
					<Link to="/reset">Forgot Password</Link>
				</div>
				<div>
					Don't have an account? <Link to="/register">Register</Link> now.
				</div>
			</div>
		</Row>
	);
}

export default LoginScreen;
