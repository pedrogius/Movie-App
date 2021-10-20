import React, { useState, useEffect } from 'react';
import { Image, Layout, Affix, Select } from 'antd';
import { useHistory, withRouter, useRouteMatch, Link } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import { useDebounce } from 'use-debounce';
import { fetchSuggestions } from '../Firebase';
import { capitalize } from '../Utils';

const { Header } = Layout;
const { Option } = Select;

const Navbar = () => {
	const history = useHistory();
	const match = useRouteMatch('/search/:searchType/:searchTerm');

	const [type, setType] = useState(match ? match.params.searchType : 'movie');
	const [value, setValue] = useState(match ? match.params.searchTerm : '');
	const [suggestions, setSuggestions] = useState([]);

	const [debouncedValue] = useDebounce(value, 500);

	useEffect(() => {
		let mounted = true;
		const func = async () => {
			if (debouncedValue.length > 2) {
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
	}, [debouncedValue, type]);

	const handleSelect = (x) => {
		setType(x);
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
							type: 'search',
							placeholder: 'search by name',
							value: value,
							onChange: (_, { newValue, method }) => {
								setValue(newValue);
							},
						}}
						alwaysRenderSuggestions={false}
						focusInputOnSuggestionClick={false}
					/>
				</div>
			</Header>
		</Affix>
	);
};

export default withRouter(Navbar);
