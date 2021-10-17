import React from 'react';
import './App.css';
import 'antd/dist/antd.dark.css';
import { Layout } from 'antd';
import { Switch, Route } from 'react-router-dom';
import SideMenu from './Components/SideMenu';
import SearchScreen from './Screens/SearchScreen';
import RegisterScreen from './Screens/RegisterScreen';
import DashboardScreen from './Screens/DashboardScreen';
import { AuthProvider } from './Context/AuthContext';
import { CountryProvider } from './Context/CountryContext';
import LoginScreen from './Screens/LoginScreen';
import ResetPasswordScreen from './Screens/ResetPasswordScreen';
import ResultScreen from './Screens/ResultScreen';
import HomeScreen from './Screens/HomeScreen';
import Navbar from './Components/Navbar';

const { Content, Footer } = Layout;

function App() {
	return (
		<AuthProvider>
			<CountryProvider>
				<Layout>
					<SideMenu />
					<Layout>
						<Navbar />
						<Content style={{ padding: '10px 50px' }}>
							<Switch>
								<Route path="/" component={HomeScreen} exact />
								<Route path="/login" component={LoginScreen} exact />
								<Route path="/register" component={RegisterScreen} exact />
								<Route path="/dashboard" component={DashboardScreen} exact />
								<Route path="/reset" component={ResetPasswordScreen} exact />
								<Route
									path={['/search/movie/:searchTerm', '/search/series/:searchTerm']}
									component={SearchScreen}
									exact
								/>
								<Route path={['/movie/:id', '/series/:id']} component={ResultScreen} exact />
							</Switch>
						</Content>
						<Footer style={{ textAlign: 'center' }}>Flixar ©2021</Footer>
					</Layout>
				</Layout>
			</CountryProvider>
		</AuthProvider>
	);
}

export default App;
