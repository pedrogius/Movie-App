import React, { useState, useEffect } from 'react';
import './App.css';
import 'antd/dist/antd.dark.css';
import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import SideMenu from './Components/SideMenu';
import SearchScreen from './Screens/SearchScreen';
import SeriesScreen from './Screens/SeriesScreen';
import CountryContext from './Context';

const { Content, Footer } = Layout;

function App() {
	const [country, setCountry] = useState('us');
	const getCountry = async () => {
		try {
			const res = await axios.get('https://api.ipdata.co?api-key=test');
			console.log(res);
		} catch (e) {
			console.log(e);
		}
	};
	useEffect(() => {
		getCountry();
	});
	return (
		<Router>
			<CountryContext.Provider value="ar">
				<Layout style={{ minHeight: '100vh' }}>
					<SideMenu />
					<Layout className="layout">
						<img src="/logo.png" alt="logo" width="250px" style={{ alignSelf: 'center' }} />
						<Content style={{ padding: '10px 50px' }}>
							<Switch>
								<Route path="/" component={SearchScreen} exact />
								<Route path="/:type/:id" component={SeriesScreen} exact />
							</Switch>
						</Content>
						<Footer style={{ textAlign: 'center' }}>Flixar ©2021</Footer>
					</Layout>
				</Layout>
			</CountryContext.Provider>
		</Router>
	);
}

export default App;
