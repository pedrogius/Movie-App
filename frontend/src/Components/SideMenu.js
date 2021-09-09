import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
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

const { Sider } = Layout;

const SideMenu = () => {
	const [collapsed, setCollapsed] = useState(true);

	const onCollapse = (collapsed) => {
		console.log(collapsed);
		setCollapsed(collapsed);
	};
	return (
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

				<Menu.Item key="2" icon={<LoginOutlined />}>
					Login
				</Menu.Item>
				<Menu.Item key="3" icon={<FireOutlined />}>
					Recommended
				</Menu.Item>
				<Menu.Item key="4" icon={<GlobalOutlined />}>
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
	);
};

export default SideMenu;
