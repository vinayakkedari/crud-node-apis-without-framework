const url = require('url');
let records = require('./records.json');
const filename = './records.json';
const fs = require('fs');

exports.insertRecord = function (req, res) {
	let body = '';

	req.on('data', function (chunk) {
		body += chunk;
	});

	req.on('end', function () {
		let newRecord = JSON.parse(body);
		const id = getNewId(records)
		const date = {
			createdAt: newDate(),
			updatedAt: newDate()
		}
		newRecord = { id, date, newRecord };

		console.log(newRecord);
		records.push(newRecord);
		let data = writeJSONFile(filename, records);

		var response = {
			"message": "Record Added."
		};

		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(response));
	});
};

exports.getRecords = function (req, res) {
	const reqUrl = url.parse(req.url, true);
	console.log("reqUrl.query.id: ", reqUrl.query.id)
	if (reqUrl.query.id) {
		mustBeInArray(records, reqUrl.query.id)
			.then(post => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(post));
			})
			.catch(err => {
				res.statusCode = 500;
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(err));
			})
	} else {
		getRecords()
			.then(posts => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(posts));
			})
			.catch(err => {
				res.statusCode = 500;
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(err));
			})
	}
};

exports.updateRecord = function (req, res) {
	const reqUrl = url.parse(req.url, true);
	console.log("reqUrl.query.id: ", reqUrl.query.id)
	if (reqUrl.query.id) {
		mustBeInArray(records, reqUrl.query.id)
			.then(record => {
				let body = '';

				req.on('data', function (chunk) {
					body += chunk;
				});

				req.on('end', function () {
					let newRecord = JSON.parse(body);
					const index = records.findIndex(p => p.id == record.id)
					let id = record.id
					const date = {
						createdAt: record.date.createdAt,
						updatedAt: newDate()
					}
					records[index] = { id, date, newRecord }
					console.log(records);
					writeJSONFile(filename, records);
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify({
						"Message": "Record Updated."
					}));
				})
			})
			.catch(err => {
				res.statusCode = 500;
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(err));
			})
	} else {
		res.statusCode = 400;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({
			"Message": "Please provide Id."
		}));
	}
};

exports.deleteRecord = function (req, res) {
	const reqUrl = url.parse(req.url, true);
	console.log("reqUrl.query.id: ", reqUrl.query.id)
	if (reqUrl.query.id) {
		mustBeInArray(records, reqUrl.query.id)
			.then(() => {
				records = records.filter(p => p.id != reqUrl.query.id)
				console.log(records);
				writeJSONFile(filename, records);
				res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify({
						"Message": "Record Deleted."
					}));
			})
			.catch(err => {
				res.statusCode = 500;
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(err));
			})
	} else {
		res.statusCode = 400;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({
			"Message": "Please provide Id."
		}));
	}
};

exports.invalidRequest = function (req, res) {
	res.statusCode = 404;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Invalid Request');
};

var getNewId = function (array) {
	if (array.length > 0) {
		return array[array.length - 1].id + 1
	} else {
		return 1
	}
}

const newDate = () => new Date().toString();

function writeJSONFile(filename, content) {
	fs.writeFileSync(filename, JSON.stringify(content), 'utf8', (err) => {
		if (err) {
			console.log(err)
		}
	})
}

function mustBeInArray(array, id) {
	return new Promise((resolve, reject) => {
		const row = array.find(r => r.id == id)
		if (!row) {
			reject({
				message: 'ID is not good',
				status: 404
			})
		}
		resolve(row)
	})
}


function getRecords() {
	return new Promise((resolve, reject) => {
		if (records.length === 0) {
			reject({
				message: 'no posts available',
				status: 202
			})
		}

		resolve(records)
	})
}


function mustBeInArray(array, id) {
	return new Promise((resolve, reject) => {
		const row = array.find(r => r.id == id)
		if (!row) {
			reject({
				message: 'ID is not good',
				status: 404
			})
		}
		resolve(row)
	})
}