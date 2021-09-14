import React from 'react';
import './App.css';
import 'antd/dist/antd.dark.css';
import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SideMenu from './Components/SideMenu';
import SearchScreen from './Screens/SearchScreen';
import SeriesScreen from './Screens/SeriesScreen';
import { AuthProvider } from './Context/AuthContext';
import { CountryProvider } from './Context/CountryContext';
import LoginScreen from './Screens/LoginScreen';

const { Content, Footer } = Layout;

function App() {
	return (
		<Router>
			<AuthProvider>
				<CountryProvider>
					<Layout style={{ minHeight: '100vh' }}>
						<SideMenu />
						<Layout className="layout">
							<img src="/logo.png" alt="logo" width="250px" style={{ alignSelf: 'center' }} />
							<Content style={{ padding: '10px 50px' }}>
								<Switch>
									<Route path="/" component={SearchScreen} exact />
									<Route path="/login" component={LoginScreen} exact />
									<Route path="/:type/:id" component={SeriesScreen} exact />
								</Switch>
							</Content>
							<Footer style={{ textAlign: 'center' }}>Flixar ©2021</Footer>
						</Layout>
					</Layout>
				</CountryProvider>
			</AuthProvider>
		</Router>
	);
}

export default App;
