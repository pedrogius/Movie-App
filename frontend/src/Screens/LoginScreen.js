import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Input, Row, Col, Spin, notification } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { signIn, signInWithGoogle } from '../Firebase';
import { AuthContext } from '../Context/AuthContext';

function LoginScreen() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [formStatus, setFormStatus] = useState('');
	const history = useHistory();

	const { user } = useContext(AuthContext);

	useEffect(() => {
		if (user) history.replace('/dashboard');
	}, [user, history]);

	useEffect(() => {
		setFormStatus('');
	}, [email, password]);

	const handleSignIn = async () => {
		try {
			setIsLoading(true);
			setFormStatus('validating');
			await signIn(email, password);

			setFormStatus('success');
			setIsLoading(false);
		} catch (e) {
			const err = e.message.split('Error ')[1].slice(1, -2);
			if (err === 'auth/invalid-email' || 'auth/wrong-password') {
				notification.error({
					message: 'Login Failed',
					description: 'Please Check Your Credentials',
					top: 100,
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
				top: 100,
			});
		} catch (e) {
			notification.error({
				message: 'Login Failed',
				description: 'Something Went Wrong',
				top: 100,
			});
			console.log(e.message);
		}
	};

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	return (
		<Row justify="center">
			<Col>
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
							label="Username"
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
							<Input value={email} onChange={(e) => setEmail(e.target.value)} />
						</Form.Item>

						<Form.Item
							label="Password"
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
							<Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
						</Form.Item>
						<Form.Item>
							<Button disabled={isLoading} type="primary" htmlType="submit">
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
			</Col>
		</Row>
	);
}

export default LoginScreen;
