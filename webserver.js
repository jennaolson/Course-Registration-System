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
console.log('user: ' + req.body.username + typeof req.body.username);
	if (req.body.username == '') {
		res.send('false');
	} else {
		var sql = 'SELECT * FROM People WHERE university_id="' + req.body.username + '"';
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
	if ((typeof req.body.otherID) == 'undefined') {
		var username = req.body.university_id;
	} else {
		var username = req.body.otherID;
	}

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

		// GET ALL REGISTERED TIMES (this takes 5ever and breaks the site with all data loaded)
        	var split = registeredString.split(',');
                var courses = [];
                var courseInfo = [];
                let promises = [];
                for (var i = 0; i < split.length; i++) {
                       	if (split[i] != '' && split[i] != 'null') {
                               	if (split[i].includes('W')) {
                                       	//courses.push(split[i].substring(1));
                               	} else {
                                       	courses.push(split[i]);
                               	}
                       	}
                }
		var allTimes = [];
                for (var j = 0; j < courses.length; j++) {
                       	promises.push(new Promise(function(resolve, reject) {
                               	var sql = 'SELECT times FROM Sections where crn="' + courses[j] + '"';
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

			if (values.length > 0 && values[0].indexOf(times) != -1 && (drop == false || drop == 'false') && (!registered.includes('W' + username))) {
				res.send('timeConflict');
			} else {
				if (drop == false || drop == 'false') {
					var split3 = registeredString.split(',');
                                        var index3 = split3.indexOf('W' + crn);
                                        if (index3 != -1) {
						registeredString = split3.slice(0, index3) + split3.slice(index3 + 1, split3.length);
					}

		        		if (registeredString.includes(crn) && !registeredString.includes('W' + crn)) {
						res.send('error');
        				} else {
						var split = registeredCourses.split(',');
						var newSplit = [];
						for (var i = 0; i < split.length; i++) {
							if (split[i] != '' && split[i] != 'null' && !split[i].includes('null') && !split[i].includes('undefined') && !split[i].includes('W')) {
								newSplit.push(split[i]);
							}
						}
						if (newSplit.length >= capacity) {
							registeredString = registeredString + ',W' + crn;
							registeredCourses = registeredCourses + ',W' + username;
							db.run('UPDATE Sections SET waitlist_count="' + (waitlist_count + 1) + '" WHERE crn="' + crn + '"');
							db.run('UPDATE Sections SET registered="' + registeredCourses + '" WHERE crn = "' + crn + '"');
							db.run('UPDATE People SET registered_courses="' + registeredString + '" WHERE university_id = "' + username + '"');
							res.send('waitlisted');
						} else {
							if (registeredString.includes('W' + crn)) {
								var split1 = registeredString.split(',');
		                                                var index1 = split1.indexOf('W' + crn);
                		                                registeredString = split1.slice(0, index1) + split1.slice(index1 + 1, split1.length);
							}
							registeredString = registeredString + ',' + crn;

							if (registeredCourses.includes('W' + username)) {
								var split2 = registeredCourses.split(',');
        		                                        var index2 = split2.indexOf('W' + username);
console.log('regCourses before split: ' + registeredCourses);
	                	                                registeredCourses = split2.slice(0, index2) + split2.slice(index2 + 1, split2.length);
console.log('regCourses after split: ' + registeredCourses);

							}
							registeredCourses = registeredCourses + ',' + username;

							db.run('UPDATE Sections SET registered="' + registeredCourses + '" WHERE crn = "' + crn + '"');
							db.run('UPDATE People SET registered_courses="' + registeredString + '" WHERE university_id = "' + username + '"');
							res.send('updated');
						}
					}
				} else {
					if (registeredCourses.includes('W' + username)) {
						var split1 = registeredCourses.split(',');
						var index1 = split1.indexOf('W' + username);
						registeredCourses = split1.slice(0, index1) + split1.slice(index1 + 1, split1.length);
					} else {
						var split2 = registeredCourses.split(',');
                                                var index2 = split2.indexOf('' + username + '');
                                                registeredCourses = split2.slice(0, index2) + split2.slice(index2 + 1, split2.length);
					}
					if (registeredString.includes('W' + crn)) {
						var split3 = registeredString.split(',');
                                                var index3 = split3.indexOf('W' + crn);
                                                registeredString = split3.slice(0, index3) + split3.slice(index3 + 1, split3.length);
					} else {
						var split4 = registeredString.split(',');
                                                var index4 = split4.indexOf('' + crn + '');
                                                registeredString = split4.slice(0, index4) + split4.slice(index4 + 1, split4.length);
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

app.post('/getWishlistData', (req, res) => {
	var crns = req.body.crns;
	var promises = [];
	var courseInfo = [];

	for (var i = 0; i < crns.length; i++) {
		promises.push(new Promise(function(resolve, reject) {
			var sql = 'SELECT crn, capacity, registered, waitlist_count FROM Sections WHERE crn=' + crns[i];
                        db.all(sql, [], (err, rows) => {
                               	if (err) {
                                	throw err;
                                }
                                rows.forEach((row) => {
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


//app.listen(port, () => {
//    console.log('Now listening on port ' + port);
//});

//https://socket.io/docs/

io.on('connection', function (socket) {
	console.log('sockets console.log');
	socket.on('updateRegistered', (data) => {
		io.emit('updateRegistered', data);
	});

	socket.on('notifyRegistered', (data) => {
		io.emit('notifyRegistered', data);
	});
});
