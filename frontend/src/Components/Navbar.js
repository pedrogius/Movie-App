import React, { useState } from 'react';
import { Image, Layout, Affix, Input, Select } from 'antd';
import { useHistory, withRouter, useRouteMatch } from 'react-router-dom';

const { Header } = Layout;
const { Search } = Input;
const { Option } = Select;

const Navbar = () => {
	const history = useHistory();
	const match = useRouteMatch('/search/:searchType/:searchTerm');

	const [type, setType] = useState(match ? match.params.searchType : 'movie');
	const [query, setQuery] = useState(match ? match.params.searchTerm : '');

	const handleSubmit = (q) => {
		setQuery(q);
		history.push(`/search/${type}/${query}`);
	};

	const handleSelect = (value) => {
		setType(value);
		handleSubmit(query);
	};
	return (
		<Affix>
			<Header
				style={{
					marginBottom: '30px',
				}}
			>
				<div className="space-align-container">
					<Image src="/logo2.png" height="100%" alt="logo" preview={false} />
					<Select defaultValue={type} onChange={handleSelect} style={{ marginRight: '10px' }}>
						<Option value="movie">Movies</Option>
						<Option value="series">Series</Option>
					</Select>
					<Search
						style={{ width: '600px' }}
						placeholder="search by name"
						defaultValue={query}
						onChange={(e) => setQuery(e.target.value)}
						onSearch={(q) => handleSubmit(q)}
					/>
				</div>
			</Header>
		</Affix>
	);
};

export default withRouter(Navbar);
