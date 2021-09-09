import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const Navbar = () => (
	<Header>
		<div className="logo" />
		<Menu theme="dark" mode="horizontal">
			<Menu.Item key="home">
				<Link to="/">Home</Link>
			</Menu.Item>
			<Menu.Item key="search">
				<Link to="/search">Search</Link>
			</Menu.Item>
		</Menu>
	</Header>
);

export default Navbar;
