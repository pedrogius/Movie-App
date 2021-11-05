const express = require('express');
const cors = require('cors');
const requestIp = require('request-ip');
const geoip = require('geoip-country');

const app = express();

app.use(cors());
app.use(requestIp.mw());

app.get('/getip', (req, res) => {
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	try {
		const country = geoip.lookup(ip.split(',')[0]);
		res.send(country);
	} catch (e) {
		res.send('US');
		console.log(e);
	}
});

app.listen(5000, () => console.log('server started'));
