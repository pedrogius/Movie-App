import React, { useState, useContext } from 'react';
import { Menu, Modal, Select, Affix } from 'antd';
import {
	LoginOutlined,
	FireOutlined,
	GlobalOutlined,
	InfoCircleOutlined,
	MenuFoldOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { CountryContext } from '../Context/CountryContext';
import { AuthContext } from '../Context/AuthContext';

const { Option } = Select;

const SideMenu = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);

	const { country, setCountry } = useContext(CountryContext);
	const { user } = useContext(AuthContext);

	const [modalCountry, setModalCountry] = useState(country);

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
	return (
		<Affix offsetTop={150} style={{ position: 'absolute' }}>
			<div>
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
				<div style={{ width: 50 }}>
					<Menu
						expandIcon={<MenuFoldOutlined />}
						defaultSelectedKeys={['1']}
						mode="inline"
						inlineCollapsed={true}
						theme="light"
						style={{ width: 50, borderRadius: '0px 5px 5px 0px' }}
						id="side-menu"
					>
						<Menu.Item
							key="1"
							icon={
								<Link to={user ? '/dashboard' : '/login'}>
									<LoginOutlined />
								</Link>
							}
						>
							{user ? 'My Account' : 'Log In / Register'}
						</Menu.Item>
						<Menu.Item key="2" icon={<GlobalOutlined />} onClick={showModal}>
							Country
						</Menu.Item>
						<Menu.Item key="3" icon={<FireOutlined />}>
							Recommended
						</Menu.Item>
						<Menu.Item key="4" icon={<InfoCircleOutlined />}>
							About
						</Menu.Item>
					</Menu>
				</div>
			</div>
		</Affix>
	);
};

export default SideMenu;
