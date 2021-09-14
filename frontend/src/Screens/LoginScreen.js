import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Input } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { signIn, signInWithGoogle, logout } from '../Firebase';
import { AuthContext } from '../Context/AuthContext';

function LoginScreen() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const history = useHistory();

	const { user } = useContext(AuthContext);

	useEffect(() => {
		//if (user) history.replace('/dashboard');
	}, [user, history]);

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	return (
		<>
			<Form
				name="basic"
				labelCol={{
					span: 8,
				}}
				wrapperCol={{
					span: 8,
				}}
				initialValues={{
					remember: true,
				}}
				onFinish={signIn}
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
				>
					<Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
				</Form.Item>

				<Form.Item
					wrapperCol={{
						offset: 8,
						span: 16,
					}}
				>
					<Button type="primary" htmlType="submit">
						Login
					</Button>
				</Form.Item>
			</Form>
			<Button onClick={signInWithGoogle}>Login with Google</Button>
			<Button onClick={logout}>Logout</Button>
			<div>
				<Link to="/reset">Forgot Password</Link>
			</div>
			<div>
				Don't have an account? <Link to="/register">Register</Link> now.
			</div>
		</>
	);
}

export default LoginScreen;
