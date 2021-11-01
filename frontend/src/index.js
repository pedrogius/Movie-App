import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorScreen from './Screens/ErrorScreen';
import App from './App';

ReactDOM.render(
	<Router>
		<ErrorBoundary FallbackComponent={ErrorScreen}>
			<App />
		</ErrorBoundary>
	</Router>,
	document.getElementById('root')
);
