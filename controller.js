const http = require('http');
const url = require('url');

module.exports = http.createServer((req, res) => {

	var service = require('./service.js');
	const reqUrl = url.parse(req.url, true);

	// GET Endpoint
	if (reqUrl.pathname == '/getRecords' && req.method === 'GET') {
		console.log('Request Type:' +
			req.method + ' Endpoint: ' +
			reqUrl.pathname);

		service.getRecords(req, res);

	} else if (reqUrl.pathname == '/insertRecord' && req.method === 'POST') {
		console.log('Request Type:' +
			req.method + ' Endpoint: ' +
			reqUrl.pathname);

		service.insertRecord(req, res);

	} else if (reqUrl.pathname == '/updateRecord' && req.method === 'PUT') {
		console.log('Request Type:' +
			req.method + ' Endpoint: ' +
			reqUrl.pathname);

		service.updateRecord(req, res);

	} else if (reqUrl.pathname == '/deleteRecord' && req.method === 'DELETE') {
		console.log('Request Type:' +
			req.method + ' Endpoint: ' +
			reqUrl.pathname);

		service.deleteRecord(req, res);

	} else {
		console.log('Request Type:' +
			req.method + ' Invalid Endpoint: ' +
			reqUrl.pathname);

		service.invalidRequest(req, res);
	}
});