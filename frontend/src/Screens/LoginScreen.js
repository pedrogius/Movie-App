import React, { useState } from 'react';
import { Form, Button, Input, Row, Col, Spin, notification } from 'antd';
import { Link, useLocation, Redirect } from 'react-router-dom';
import { signIn, signInWithGoogle } from '../Firebase';
import { parseFirebaseError } from '../Utils';

function LoginScreen() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [formStatus, setFormStatus] = useState('');
	const [disabled, setDisabled] = useState(false);
	const [redirectToReferrer, setRedirectToReferrer] = useState(false);

	const { state } = useLocation();

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
			const { type } = parseFirebaseError(e.message);
			if (type === 'auth') {
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
			</Col>
		</Row>
	);
}

export default LoginScreen;
