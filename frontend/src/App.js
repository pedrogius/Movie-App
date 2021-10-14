import React from 'react';
import './App.css';
import 'antd/dist/antd.dark.css';
import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SideMenu from './Components/SideMenu';
import SearchScreen from './Screens/SearchScreen';
import RegisterScreen from './Screens/RegisterScreen';
import DashboardScreen from './Screens/DashboardScreen';
import { AuthProvider } from './Context/AuthContext';
import { CountryProvider } from './Context/CountryContext';
import LoginScreen from './Screens/LoginScreen';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';
import ResultScreen from './Screens/ResultScreen';

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
									<Route path="/register" component={RegisterScreen} exact />
									<Route path="/dashboard" component={DashboardScreen} exact />
									<Route path="/reset" component={ResetPasswordScreen} exact />
									<Route path="/:type/:id" component={ResultScreen} exact />
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
