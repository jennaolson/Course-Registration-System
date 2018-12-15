// built in node.js modules
var fs = require('fs');
var path = require('path');
var http = require('http');
var url = require('url');
var express = require('express');
var sqlite3 = require('sqlite3');

// downloaded node.js modules
var mime = require('mime-types');
var WebSocket = require('ws');

var app = express();
var port = 8017;
var public_dir = path.join(__dirname, 'public');

var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(port);


const bodyParser = require('body-parser')

var db = new sqlite3.Database(path.join(__dirname, 'db', 'course_db.sqlite3'),  (err) => {
    if (err) {
        console.log('Error opening course_db  database');
    }
    else {
        console.log('Now connected to course_db  database!');
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(express.static(public_dir));

app.post('/data', (req, res) => {
	res.end();

	db.run('INSERT INTO People (university_id, position, password, first_name, last_name, registered_courses) VALUES (?, ?, ?, ?, ?, ?)', [req.body.university_id, req.body.position, req.body.password, req.body.first_name, req.body.last_name, 'null']);
});

app.post('/checkUser', (req, res) => {

	if (req.body.username = '') {
		res.send('false');
	} else {

		var sql = 'SELECT * FROM People WHERE university_id= "' + req.body.username + '"';
		db.all(sql, [], (err, rows) => {
			if (err) {
				throw err;
			}
			if (rows.length > 0) {
				res.send('false');
			} else {
				res.send('true');
			}
		});
	}
});

app.post('/checkLogin', (req, res) => {
	var sql = 'SELECT * FROM People WHERE university_id = "' + req.body.username + '" AND password = "' + req.body.password + '"';
	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		if (rows.length > 0) {
			res.send(rows[0]);
		} else {
			res.send('false');
		}
	});
});

app.post('/search', (req, res) => {
	let getDepartments = 'SELECT full_name name FROM Departments';
	var departments = [];
	db.all(getDepartments, [], (err, rows) => {
        	if (err) {
                	throw err;
        	}
	        rows.forEach((row) => {
        	        departments.push(row.name);
	        });
        	res.send(departments);
	});
});

app.post('/searchData', (req, res) => {

	var result = {};
	var courses = [];
	var getCourses = '';
	let promises = [];

	for(var i = 0; i < req.body.departments.length; i++) {
	    promises.push(new Promise(function(resolve, reject) {
		var theCourses = []
		if (req.body.course_number === '' && req.body.crn === '') {
			getCourses = 'SELECT Sections.waitlist_count, Sections.subject, Sections.course_number, Sections.section_number, Sections.building, Sections.room, Sections.professors, Sections.crn, Sections.capacity, Courses.name, Courses.credits, Courses.description, Sections.times, Sections.registered FROM Sections INNER JOIN Courses ON Courses.course_number = Sections.course_number WHERE Sections.subject = "' + req.body.departments[i].substring(0, 4) + '" and Courses.subject = "' + req.body.departments[i].substring(0, 4) + '"';
		} else if (req.body.crn === '') {
			getCourses = 'SELECT Sections.waitlist_count, Sections.subject, Sections.course_number, Sections.section_number, Sections.building, Sections.room, Sections.professors, Sections.crn, Sections.capacity, Courses.name, Courses.credits, Courses.description, Sections.times, Sections.registered FROM Sections INNER JOIN Courses ON Courses.course_number = Sections.course_number WHERE Sections.course_number = "' + req.body.course_number + '" AND Sections.subject = "' + req.body.departments[i].substring(0, 4) + '" and Courses.subject = "' + req.body.departments[i].substring(0, 4) + '"';
		} else if (req.body.course_number === '') {
			getCourses = 'SELECT Sections.waitlist_count, Sections.subject, Sections.course_number, Sections.section_number, Sections.building, Sections.room, Sections.professors, Sections.crn, Sections.capacity, Courses.name, Courses.credits, Courses.description, Sections.times, Sections.registered FROM Sections INNER JOIN Courses ON Courses.course_number = Sections.course_number WHERE Sections.crn = "' + req.body.crn + '" AND Sections.subject = "' + req.body.departments[i].substring(0, 4) + '" and Courses.subject = "' + req.body.departments[i].substring(0, 4) + '"';
		} else {
			getCourses = 'SELECT Sections.waitlist_count, Sections.subject, Sections.course_number, Sections.section_number, Sections.building, Sections.room, Sections.professors, Sections.crn, Sections.capacity, Courses.name, Courses.credits, Courses.description, Sections.times, Sections.registered FROM Sections INNER JOIN Courses ON Courses.course_number = Sections.course_number WHERE Sections.course_number = "' + req.body.course_number + '" AND Sections.crn = "' + req.body.crn + '" AND Sections.subject = "' + req.body.departments[i].substring(0, 4) + '" and Courses.subject = "' + req.body.departments[i].substring(0, 4) + '"';
		}

		db.all(getCourses, [], (err, rows) => {
			if (err) {
				throw err;
			}
			rows.forEach((row) => {
				theCourses.push(row);
			});
			resolve(theCourses);
		});
	    }));
	}

	Promise.all(promises).then(function(values) {
		res.send(values);
	});
});

app.post('/register', (req, res) => {
	var username = req.body.university_id;
	var crn = req.body.crn;
	var capacity = req.body.capacity;
	var registered = req.body.registered;
	var waitlist_count = req.body.waitlist_count;
	var drop = req.body.drop;
	var registeredString = '';

	var promise = new Promise(function(resolve, reject) {
		var regString = '';
		var getStudentRow = 'SELECT registered_courses FROM People WHERE university_id="' + username + '"';
		db.all(getStudentRow, [], (err, rows) => {
			if (err) {
				throw err;
			}
			rows.forEach((row) => {
				regString = row.registered_courses;
			});
			resolve(regString);
		});
	});

	var promise2 = new Promise(function(resolve, reject) {
		var regCourses = '';
		var getRegistered = 'SELECT registered, times from Sections WHERE crn="' + crn + '"';
		db.all(getRegistered, [], (err, rows) => {
			if (err) {
				throw err;
			}
			rows.forEach((row) => {
				regCourses = row;
			});
			resolve(regCourses);
		});

	});

	Promise.all([promise, promise2]).then(function (result) {
		registeredString = result[0];
		registeredCourses = result[1].registered;
		times = result[1].times;


		// GET ALL REGISTERED TIMES
        	var split = registeredString.split(',');
                var courses = [];
                var courseInfo = [];
                let promises = [];
                for (var i = 0; i < split.length; i++) {
                       	if (split[i] != '' && split[i] != 'null') {
                               	if (split[i].includes('W')) {
                                       	courses.push(split[i].substring(1));
                               	} else {
                                       	courses.push(split[i]);
                               	}
                       	}
                }

		var allTimes = [];
                for (var j = 0; j < courses.length; j++) {
                       	promises.push(new Promise(function(resolve, reject) {
                               	var sql = 'SELECT times FROM Sections where crn="' + courses[j]  + '"';
                               	db.all(sql, [], (err, rows) => {
                                       	if (err) {
                                               	throw err;
                                       	}
                                       	rows.forEach((row) => {
                                               allTimes.push(row.times);
                                       	});
                                       	resolve(allTimes);
                              	});
                   	}));
                }

                Promise.all(promises).then(function(values) {
			if (values.length > 0 && values[0].indexOf(times) != -1 && (drop == false || drop == 'false')) {
				res.send('timeConflict');
			} else {

				if (drop == false || drop == 'false') {
		        		if (registeredString.includes(crn)) {
						res.send('error');
        				} else {
						var split = registeredCourses.split(',');
						var newSplit = [];
						for (var i = 0; i < split.length; i++) {
							if (split[i] != '' && split[i] != 'null') {
								newSplit.push(split[i]);
							}
						}
						console.log(newSplit);
						if (newSplit.length >= capacity) {
							console.log(newSplit.length);
							registeredString = registeredString + ',W' + crn;
							registeredCourses = registeredCourses + ',W' + username;
							db.run('UPDATE Sections SET waitlist_count="' + (waitlist_count + 1) + '" WHERE crn="' + crn + '"');
							db.run('UPDATE Sections SET registered="' + registeredCourses + '" WHERE crn = "' + crn + '"');
							db.run('UPDATE People SET registered_courses="' + registeredString + '" WHERE university_id = "' + username + '"');
							res.send('waitlisted');
						} else {
							registeredString = registeredString + ',' + crn;
	        	        		        registeredCourses = registeredCourses + ',' + username;
							db.run('UPDATE Sections SET registered="' + registeredCourses + '" WHERE crn = "' + crn + '"');
							db.run('UPDATE People SET registered_courses="' + registeredString + '" WHERE university_id = "' + username + '"');
							res.send('updated');
						}
					}
				} else {
					// wanna remove extra commas? alter the addition of the splits here
					if (registeredCourses.includes('W' + username)) {
						var splitC = registeredCourses.split('W' + username);
		                	        registeredCourses = splitC[0] + splitC[1];
					} else {
						var splitC = registeredCourses.split(username);
	        		                registeredCourses = splitC[0] + splitC[1];
					}
					if (registeredString.includes('W' + crn)) {
						var splitS = registeredString.split('W' + crn);
	        		                registeredString = splitS[0] + splitS[1];
					} else {
						var splitS = registeredString.split(crn);
						registeredString = splitS[0] + splitS[1];
					}

					db.run('UPDATE Sections SET registered="' + registeredCourses + '" WHERE crn = "' + crn + '"');
					db.run('UPDATE People SET registered_courses="' + registeredString + '" WHERE university_id = "' + parseInt(username) + '"');

					res.send('dropped');
				}
			}
		});
	});
});

app.post('/roster', (req, res) => {
	var sql = 'SELECT registered FROM Sections WHERE crn="' + req.body.crn + '"';
	var promise = new Promise(function(resolve, reject) {
		var registered = '';
		db.all(sql, [], (err, rows) => {
			if (err) {
				throw err;
			}
			rows.forEach((row) => {
				registered = registered + row.registered;
			});
			resolve(registered);
		});
	});

	promise.then(function(result) {
		res.send(result);
	});
});

app.post('/getSchedule', (req, res) => {
	var courseString;
	var sql = 'SELECT registered_courses FROM People WHERE university_id="' + req.body.university_id + '"';
	var promise = new Promise(function (resolve, reject) {
		db.all(sql, [], (err, rows) => {
			if (err) {
				throw err;
			}
			rows.forEach((row) => {
				courseString = row.registered_courses;
			});
			resolve(courseString);
		});
	});

	promise.then(function(result) {
		var split = result.split(',');
		var courses = [];
		var courseInfo = [];
		let promises = [];
		var waitlisted = [];
		for (var i = 0; i < split.length; i++) {
			if (split[i] != '' && split[i] != 'null') {
				if (split[i].includes('W')) {
					courses.push(split[i].substring(1));
					waitlisted.push(parseInt(split[i].substring(1)));
				} else {
					courses.push(split[i]);
				}
			}
		}

		for (var j = 0; j < courses.length; j++) {
			promises.push(new Promise(function(resolve, reject) {
				var sql = 'SELECT subject, course_number, section_number, crn, times FROM Sections where crn="' + courses[j] + '"';
				db.all(sql, [], (err, rows) => {
					if (err) {
						throw err;
					}
					rows.forEach((row) => {
						if (waitlisted.includes(row.crn)) {
							row.crn = 'W' + row.crn;
						}
						courseInfo.push(row);
					});
					resolve(courseInfo);
				});
			}));
		}

		Promise.all(promises).then(function(values) {
			res.send(values);
		});

	});
});

//app.listen(port, () => {
//    console.log('Now listening on port ' + port);
//});

//https://socket.io/docs/

io.on('connection', function (socket) {
	console.log('socktes console.log');
	socket.emit('updateRegistered', 'sockets!!!');
});


/*
ioserver = io(server);
var num_clients = 0;
ioserver.on('connection', (client) => {
        num_clients++;
        ioserver.emit('UpdateClientCount', num_clients);
        client.on('disconnect', () => {
                num_clients--;
                ioserver.emit('UpdateClientCount', num_clients);
        });
        client.on('ChatMessage', (message) => {
                ioserver.emit('ChatMessage', message);
        })
});

*/
