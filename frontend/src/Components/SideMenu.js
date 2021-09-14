import React, { useState, useContext } from 'react';
import { Layout, Menu, Modal, Select } from 'antd';
import {
	SearchOutlined,
	LoginOutlined,
	FireOutlined,
	GlobalOutlined,
	StarOutlined,
	EyeOutlined,
	InfoCircleOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { CountryContext } from '../Context/CountryContext';
import { AuthContext } from '../Context/AuthContext';

const { Sider } = Layout;
const { Option } = Select;

const SideMenu = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [collapsed, setCollapsed] = useState(true);
	const [modalCountry, setModalCountry] = useState(null);

	const { country, setCountry } = useContext(CountryContext);
	const { user } = useContext(AuthContext);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
		window.localStorage.setItem('userCountry', modalCountry);
		setCountry(modalCountry);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const onCollapse = (collapsed) => {
		setCollapsed(collapsed);
	};
	return (
		<>
			<Modal
				title="Choose Country"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<p>Choose Country</p>
				<Select
					defaultValue={country}
					style={{ width: 120 }}
					onChange={(value) => setModalCountry(value)}
				>
					<Option value="AR">Argentina</Option>
					<Option value="US">United States</Option>
				</Select>
			</Modal>
			<Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
				<Menu theme="dark">
					<Menu.Item
						key="1"
						icon={
							<Link to="/">
								<SearchOutlined />
							</Link>
						}
					>
						Search
					</Menu.Item>

					<Menu.Item
						key="2"
						icon={
							<Link to="/login">
								<LoginOutlined />
							</Link>
						}
					>
						{user ? 'My Account' : 'Login'}
						{console.log(user)}
					</Menu.Item>
					<Menu.Item key="3" icon={<FireOutlined />}>
						Recommended
					</Menu.Item>
					<Menu.Item key="4" icon={<GlobalOutlined />} onClick={showModal}>
						Country
					</Menu.Item>
					<Menu.Item key="5" icon={<StarOutlined />}>
						Favorites
					</Menu.Item>
					<Menu.Item key="6" icon={<EyeOutlined />}>
						Seen
					</Menu.Item>
					<Menu.Item key="7" icon={<InfoCircleOutlined />}>
						About
					</Menu.Item>
				</Menu>
			</Sider>
		</>
	);
};

export default SideMenu;
