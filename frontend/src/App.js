import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import { Route } from 'react-router-dom';
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
import ErrorScreen from './Screens/ErrorScreen';
import Navbar from './Components/Navbar';
import ScrollToTop from './Components/ScrollToTop';
import CustomSwitch from './Components/CustomSwitch';
import PrivateRoute from './Components/PrivateRoute';
import { ErrorBoundary } from 'react-error-boundary';

const { Content, Footer } = Layout;

function App() {
	return (
		<AuthProvider>
			<CountryProvider>
				<Layout>
					<Navbar />
					<Layout>
						<ScrollToTop />
						<SideMenu />
						<Content style={{ padding: '40px 80px' }}>
							<ErrorBoundary FallbackComponent={ErrorScreen}>
								<CustomSwitch>
									<Route path="/" component={HomeScreen} exact />
									<Route path="/login" component={LoginScreen} exact />
									<Route path="/register" component={RegisterScreen} exact />
									<PrivateRoute path="/dashboard" exact>
										<DashboardScreen />
									</PrivateRoute>
									<Route path="/reset" component={ResetPasswordScreen} exact />
									<Route
										path={['/search/movie/:searchTerm', '/search/series/:searchTerm']}
										component={SearchScreen}
										exact
									/>
									<Route path={['/movie/:id', '/series/:id']} component={ResultScreen} exact />
								</CustomSwitch>
							</ErrorBoundary>
						</Content>
						<Footer style={{ textAlign: 'center' }}>Flixar ©2021</Footer>
					</Layout>
				</Layout>
			</CountryProvider>
		</AuthProvider>
	);
}

export default App;
