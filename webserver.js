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
var port = 8018;
var public_dir = path.join(__dirname, 'public');

const bodyParser = require('body-parser')

var db = new sqlite3.Database(path.join(__dirname, 'db', 'course_db.sqlite3'),  (err) => {
    if (err) {
        console.log('Error opening course_db  database');
    }
    else {
        console.log('Now connected to course_db  database!');
    }
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.static(public_dir));

app.post('/data', (req, res) => {
	res.end();

	db.run('INSERT INTO People (university_id, position, password, first_name, last_name, registered_courses) VALUES (?, ?, ?, ?, ?, ?)', [req.body.university_id, req.body.position,  req.body.password, req.body.first_name, req.body.last_name, 'null']);
});

app.post('/checkUser', (req, res) => {
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
			getCourses = 'SELECT Sections.subject, Sections.course_number, Sections.section_number, Sections.building, Sections.room, Sections.professors, Sections.crn, Sections.capacity, Courses.name, Courses.credits, Courses.description, Sections.times, Sections.registered FROM Sections LEFT OUTER JOIN Courses ON Courses.course_number = Sections.course_number WHERE Sections.subject = "' + req.body.departments[i].substring(0, 4) + '"';
		} else if (req.body.crn === '') {
			getCourses = 'SELECT Sections.subject, Sections.course_number, Sections.section_number, Sections.building, Sections.room, Sections.professors, Sections.crn, Sections.capacity, Courses.name, Courses.credits, Courses.description, Sections.times, Sections.registered FROM Sections LEFT OUTER JOIN Courses ON Courses.course_number = Sections.course_number WHERE Sections.course_number = "' + req.body.course_number + '" AND Sections.subject = "' + req.body.departments[i].substring(0, 4) + '"';
		} else if (req.body.course_number === '') {
			getCourses = 'SELECT Sections.subject, Sections.course_number, Sections.section_number, Sections.building, Sections.room, Sections.professors, Sections.crn, Sections.capacity, Courses.name, Courses.credits, Courses.description, Sections.times, Sections.registered FROM Sections LEFT OUTER JOIN Courses ON Courses.course_number = Sections.course_number WHERE Sections.crn = "' + req.body.crn + '" AND Sections.subject = "' + req.body.departments[i].substring(0, 4) + '"';
		} else {
			getCourses = 'SELECT Sections.subject, Sections.course_number, Sections.section_number, Sections.building, Sections.room, Sections.professors, Sections.crn, Sections.capacity, Courses.name, Courses.credits, Courses.description, Sections.times, Sections.registered FROM Sections LEFT OUTER JOIN Courses ON Courses.course_number = Sections.course_number WHERE Sections.course_number = "' + req.body.course_number + '" AND Sections.crn = "' + req.body.crn + '" AND Sections.subject = "' + req.body.departments[i].substring(0, 4) + '"';
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
		var getRegistered = 'SELECT registered from Sections WHERE crn="' + crn + '"';

		db.all(getRegistered, [], (err, rows) => {
			if (err) {
				throw err;
			}
			rows.forEach((row) => {
				regCourses = row.registered;
			});
			resolve(regCourses);
		});

	});

	Promise.all([promise, promise2]).then((result) => {
		console.log(result);
		registeredString = result[0];
		registeredCourses = result[1];

	        if (registeredString.includes(crn)) {
			res.send('error');
        	} else {
			registeredString = registeredString + ',' + crn;
			registeredCourses = registeredCourses + ',' + username;
			db.run('UPDATE People SET registered_courses="' + registeredString + '" WHERE university_id = "' + username + '"');
			db.run('UPDATE Sections SET registered="' + registeredCourses + '" WHERE crn = "' + crn + '"');

			res.send('updated');
		}
	});
});








app.listen(port, () => {
    console.log('Now listening on port ' + port);
});

