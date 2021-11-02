import React, { useState, useEffect, useContext } from 'react';
import { Image, Layout, Affix, Select, Input, Dropdown, Menu } from 'antd';
import { useHistory, withRouter, useRouteMatch, Link } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import { useDebounce } from 'use-debounce';
import { fetchSuggestions, logout } from '../Firebase';
import { capitalize } from '../Utils';
import { DownOutlined, LogoutOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { AuthContext } from '../Context/AuthContext';

const { Header } = Layout;
const { Option } = Select;

const Navbar = () => {
	const history = useHistory();
	const match = useRouteMatch('/search/:searchType/:searchTerm');
	const { user } = useContext(AuthContext);

	const [type, setType] = useState(match ? match.params.searchType : 'movie');
	const [value, setValue] = useState(match ? match.params.searchTerm : '');
	const [suggestions, setSuggestions] = useState([]);
	const [hasTyped, setHasTyped] = useState(false);

	const [debouncedValue] = useDebounce(value, 500);

	useEffect(() => {
		let mounted = true;
		const func = async () => {
			if (debouncedValue.length > 2 && hasTyped) {
				const res = await fetchSuggestions(capitalize(debouncedValue), type);
				if (mounted) {
					setSuggestions(res);
				}
			}
		};
		func();
		return () => {
			mounted = false;
		};
	}, [debouncedValue, type, hasTyped]);

	const handleSelect = (x) => {
		setType(x);
	};

	const menu = (
		<Menu>
			<Menu.Item key="1" icon={<UserOutlined />}>
				<Link to="/dashboard">My Profile</Link>
			</Menu.Item>
			<Menu.Item key="2" icon={<LogoutOutlined />} onClick={logout}>
				Logout
			</Menu.Item>
		</Menu>
	);

	return (
		<Affix>
			<Header>
				<div className="nav-container">
					<div className="logo">
						<Link to="/">
							<Image src="/logo2.png" height="100%" alt="logo" preview={false} />
						</Link>
					</div>
					<div className="search">
						<Select defaultValue={type} onChange={handleSelect} style={{ marginRight: '10px' }}>
							<Option value="movie">Movies</Option>
							<Option value="series">Series</Option>
						</Select>
						<Autosuggest
							suggestions={suggestions}
							//every time i need to clear suggestions
							onSuggestionsClearRequested={() => setSuggestions([])}
							//will be called everytime i need to update suggestions
							onSuggestionsFetchRequested={({ value, reason }) => {
								if (reason === 'input-changed') {
									setValue(value);
								}
							}}
							onSuggestionSelected={(_, { suggestion, suggestionValue }) =>
								history.push(`/${type}/${suggestion.id}`)
							}
							//maps suggestions to input value
							getSuggestionValue={(suggestion) => suggestion.title}
							renderSuggestion={(suggestion) => (
								<div style={{ display: 'flex', alignContent: 'center' }}>
									<Image
										src={suggestion.poster}
										height="60px"
										preview={false}
										alt={suggestion.title}
									/>
									<span style={{ marginLeft: '5px' }}>
										{suggestion.title} ({suggestion.year})
									</span>
								</div>
							)}
							inputProps={{
								placeholder: 'search by name',
								value: value,
								onChange: (_, { newValue, method }) => {
									if (method === 'type') {
										setHasTyped(true);
									} else if (method === 'up' || 'down') {
										setHasTyped(false);
									}
									setValue(newValue);
								},
							}}
							renderInputComponent={(inputProps) => (
								<form
									onSubmit={(e) => {
										e.preventDefault();
										history.push(`/search/${type}/${value}`);
									}}
									style={{ display: 'flex', alignItems: 'center' }}
								>
									<Input {...inputProps} suffix={<SearchOutlined />} style={{ width: '500px' }} />
								</form>
							)}
							alwaysRenderSuggestions={false}
							focusInputOnSuggestionClick={false}
						/>
					</div>
					<div className="account">
						{user ? (
							<Dropdown overlay={menu}>
								<span className="nav-account-link">
									My Account <DownOutlined />
								</span>
							</Dropdown>
						) : (
							<Link to="/login" className="nav-account-link">
								Login
							</Link>
						)}
					</div>
				</div>
			</Header>
		</Affix>
	);
};

export default withRouter(Navbar);
