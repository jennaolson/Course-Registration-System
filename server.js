var path = require('path');
var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var axios = require('axios');
var DOMParser = require('dom-parser');

var app = express();
var port = 8017;
var term = "20";
var year = "2019";

var db = new sqlite3.Database(path.join(__dirname, 'db', 'course_db.sqlite3'),  (err) => {
    if (err) {
        console.log('Error opening course_db  database');
    }
    else {
        console.log('Now connected to course_db  database!');
    }
});

db.serialize(() => {
	db.run("CREATE TABLE IF NOT EXISTS Departments (subject TEXT, full_name TEXT, PRIMARY KEY (subject))");
	db.run("CREATE TABLE IF NOT EXISTS Courses (subject TEXT, course_number TEXT, credits INTEGER, name TEXT, description TEXT, PRIMARY KEY (subject, course_number))");
	db.run("CREATE TABLE IF NOT EXISTS Sections (crn INTEGER, subject TEXT, course_number TEXT, section_number TEXT, building TEXT, room TEXT, professors TEXT, times TEXT, capacity INTEGER, registered TEXT, waitlist_count TEXT, waitlist TEXT, PRIMARY KEY (crn))");
	db.run("CREATE TABLE IF NOT EXISTS People (university_id INTEGER, position TEXT, password TEXT, first_name TEXT, last_name TEXT, registered_courses TEXT, PRIMARY KEY (university_id))");

	// Common Variables
	var departmentSubjects = [];

	// CALLS TO COURSE FINDER - DEPARTMENTS
	axios.get("https://classes.aws.stthomas.edu/index.htm?year=" + year + "&term=" + term + "&schoolCode=ALL&levelCode=ALL&selectedSubjects=FAKE")
    	.then(response => {
		var parser = new DOMParser();
		htmlDoc = parser.parseFromString(response.data);

		var subjectTotal = htmlDoc.getElementsByName("totalSubjects");
		var subjectTotalInt = parseInt(subjectTotal[0].getAttribute("value"));

		var stmt = db.prepare("INSERT INTO Departments VALUES (?, ?)");
		var subjects = htmlDoc.getElementById('subjects');

		for (var i = 0; i < subjectTotalInt; i++) {
			var subject =  htmlDoc.getElementById('selectedSubjects' + i + '1').getAttribute('value');
			departmentSubjects.push(subject);

			var course_name = subjects.getElementsByTagName("label")[i].textContent;
			
			if (course_name.includes("&amp;")){
				course_name = course_name.replace("&amp;", "&");
        		}
        		if (course_name.includes("&#39;")){
				course_name = course_name.replace("&#39;", "'");
        		}

			stmt.run(subject, course_name);
		}
		stmt.finalize();


		// CALLS TO COURSE FINDER - COURSES & SECTIONS
        	for (var i = 0; i < departmentSubjects.length; i++) {
			var subject = departmentSubjects[i];
                	axios.get("https://classes.aws.stthomas.edu/index.htm?year=" + year + "&term=" + term + "&schoolCode=ALL&levelCode=ALL&selectedSubjects=" + departmentSubjects[i])
                        	.then(response => {

                                	var parser = new DOMParser();
                			htmlDoc = parser.parseFromString(response.data);

					var stmtCourses = db.prepare("INSERT INTO Courses VALUES (?, ?, ?, ?, ?)");
					var stmtSections = db.prepare("INSERT INTO Sections VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

					var query = htmlDoc.getElementById('queryString');
					var subject = query.getAttribute('value').substring(query.getAttribute('value').length - 4, query.getAttribute('value').length);

					var course_numbers = [];
					var section_numbers = [];
					var course_and_section_numbers = [];
					var elementONumbers = htmlDoc.getElementsByClassName('courseOpen');
					var elementCNumbers = htmlDoc.getElementsByClassName('courseClosed');
					var elementWNumbers = htmlDoc.getElementsByClassName('courseWaitlist');
					var elementNumbers = elementONumbers.concat(elementWNumbers).concat(elementCNumbers);

					for (var j = 0; j < elementNumbers.length; j++) {
						var element = elementNumbers[j].innerHTML;
						if (!element.includes('OPEN') && !element.includes('CLOSED') && !element.includes('WAITLISTED') && !element.includes('LIST')) {
							course_and_section_numbers.push(element);
						}
					}

					course_and_section_numbers = course_and_section_numbers.sort();

					for (var n = 0; n < course_and_section_numbers.length; n++) {
						course_numbers.push(course_and_section_numbers[n].substring(0, 3));
						section_numbers.push(course_and_section_numbers[n].substring(4));
					}

					var crns = [];
					var credits = [];
					var elements = htmlDoc.getElementsByClassName('courseInfoHighlight');
					for (var k = 0; k < elements.length; k++) {
						if (elements[k].innerHTML.includes('Credits')) {
                                                        credits.push(parseInt(elements[k].innerHTML.substring(11, elements[k].innerHTML.indexOf('C') - 1)));
                                                }
						if (elements[k].innerHTML.includes('CRN')) {
							crns.push(elements[k].innerHTML.trim().substring(5));
						}
					}

					var buildings = [];
					var rooms = [];
					var elementLocations = htmlDoc.getElementsByClassName('locationHover');
					for (var m = 0; m < elementLocations.length; m++) {
						if (elementLocations[m].innerHTML.includes('Online')) {
							buildings.push('Online');
							rooms.push('NULL');
						} if (elementLocations[m].innerHTML.includes('No Room')) {
							buildings.push('NULL');
							rooms.push('No Room');
						}
						else {
							buildings.push(elementLocations[m].innerHTML.trim().substring(0, 3));
							rooms.push(elementLocations[m].innerHTML.trim().substring(4));
						}
					}

					var professors = [];
					var elementProfessors = htmlDoc.getElementsByClassName('columns small-3 medium-2 large-2');
					for (var p = 0; p < elementProfessors.length; p++) {
						if (elementProfessors[p].innerHTML.includes('TBD')) {
							professors.push('TBD');
						} else {
							professors.push(elementProfessors[p].innerHTML.trim().substring(0, 2) + " " + elementProfessors[p].innerHTML.trim().substring(2).trim());
						}
					}

					var course_times = [];
					var capacities = [];
					var elementCourses = htmlDoc.getElementsByClassName('courseCalendar');
					var elementCapacities = htmlDoc.getElementsByClassName('columns small-2');

					for (var r = 0; r < elementCourses.length; r++) {
						elementCourseTimes = elementCourses[r].getElementsByTagName('td');
						var course_string = '';
						var count = 0;
						for (var q = 0; q < elementCourseTimes.length; q++) {
							var days = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];
							if (elementCourseTimes[q].getAttribute('class') == 'time' && elementCourseTimes[q].outerHTML.includes('strong')) {
								course_string = course_string + elementCourseTimes[q].outerHTML;
								count = count + 1;
							}
                                                	if (elementCourseTimes[q].getAttribute('class') == 'time') {
                                                        	var elementTime = elementCourseTimes[q].innerHTML;
                                                        	course_string = course_string + days[count] + ': ' + (elementTime.substring(0, elementTime.indexOf('<')) + ' - ' + elementTime.substring(elementTime.indexOf('<') + 5, elementTime.lastIndexOf('m') + 1))+ ', ';
                                                		count = count + 1;
							} if (elementCourseTimes[q].getAttribute('class') == 'noTime') {
								count = count + 1;
                                                	}
                                        	}
						course_times.push(course_string);
						capacities.push(parseInt(elementCapacities[r].innerHTML.trim().substring(6)));
					}

					var course_names = [];
					var course_info = [];
					var elementNames = htmlDoc.getElementsByClassName('columns small-6 medium-4 large-4');
					var elementInfo = htmlDoc.getElementsByClassName('courseInfo');
					for (var l = 0; l < elementNames.length; l++) {
						course_names.push(elementNames[l].innerHTML.trim());
						course_info.push(elementInfo[l].innerHTML.trim());
					}

					// Reset arrays to include only unique courses
					var master_course_numbers = [];
					var master_credits = [];
					var master_course_names = [];
					var master_course_info = []
					for (var course = 0; course < course_numbers.length; course++) {
						if (!master_course_numbers.includes(course_numbers[course])) {
							master_course_numbers.push(course_numbers[course]);
							master_credits.push(credits[course]);
							master_course_names.push(course_names[course]);
							master_course_info.push(course_info[course]);
						}
					}

					// Add courses to table
					for (var course = 0; course < master_course_numbers.length; course++) {
						stmtCourses.run(subject, master_course_numbers[course], master_credits[course], master_course_names[course], master_course_info[course]);
					}
					stmtCourses.finalize();

					// Add sections to table
					for (var course = 0; course < course_numbers.length; course++) {
						stmtSections.run(crns[course], subject, course_numbers[course], section_numbers[course], buildings[course], rooms[course], professors[course], course_times[course], capacities[course], 'null', 0, '');
					}
					stmtSections.finalize();
                	});
        	}
	});
});

app.listen(port, () => {
    console.log('Now listening on port ' + port);
});

