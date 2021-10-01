import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Input } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { register, signInWithGoogle } from '../Firebase';
import { AuthContext } from '../Context/AuthContext';

const RegisterScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const history = useHistory();

	const { user } = useContext(AuthContext);

	useEffect(() => {
		if (user) history.replace('/dashboard');
	}, [user, history]);

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	const signUp = () => {
		register(email, password);
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
				onFinish={signUp}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
			>
				<Form.Item
					label="Email"
					name="email"
					rules={[
						{
							required: true,
							message: 'Please input your email!',
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
					hasFeedback
				>
					<Input.Password value={password} onChange={(e) => setPassword(e.target.value)} />
				</Form.Item>
				<Form.Item
					name="confirm"
					label="Confirm Password"
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
									return Promise.resolve();
								}

								return Promise.reject(
									new Error('The two passwords that you entered do not match!')
								);
							},
						}),
					]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item
					wrapperCol={{
						offset: 8,
						span: 16,
					}}
				>
					<Button type="primary" htmlType="submit">
						Sign Up
					</Button>
				</Form.Item>
			</Form>
			<Button onClick={signInWithGoogle}>Login with Google</Button>
			<div>
				Already have an account? <Link to="/login">Login</Link> now.
			</div>
		</>
	);
};

export default RegisterScreen;
