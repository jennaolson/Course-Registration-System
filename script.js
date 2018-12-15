var app;
var socket;

function Init() {
	app = new Vue({
		el: '#app',
  		data: {
    			departments: [],
			courses: [],
			user: {
				university_id: 'test',
				position: 'test',
				courses: [],
			},
			tempRegistered = '',
		},
		methods: {
        	    populateDepartments: function (depts) {
        	        for (var i = 0; i < depts.length; i++) {
        	            var dept = depts[i];
        	            this.departments.push(dept);
        	        }
        	    },
		    updateUser(position) {
			this.user.position = position;
		    }
		}
	});

	axios.post('/search')
        .then(res => {
                app.populateDepartments(res.data);
        });
}

function fullPage() {
	var box = document.getElementById('box');
        box.style.display = 'none';
        var newBox = document.getElementById('new');
        newBox.style.display = 'block';
}

function stopLoading() {
	$('#loader').css('display', 'none');
        $('#search_results').css('visibility', 'visible');
}

// HASHING
!function(n){"use strict";function t(n,t){var r=(65535&n)+(65535&t);return(n>>16)+(t>>16)+(r>>16)<<16|65535&r}function r(n,t){return n<<t|n>>>32-t}function e(n,e,o,u,c,f){return t(r(t(t(e,n),t(u,f)),c),o)}function o(n,t,r,o,u,c,f){return e(t&r|~t&o,n,t,u,c,f)}function u(n,t,r,o,u,c,f){return e(t&o|r&~o,n,t,u,c,f)}function c(n,t,r,o,u,c,f){return e(t^r^o,n,t,u,c,f)}function f(n,t,r,o,u,c,f){return e(r^(t|~o),n,t,u,c,f)}function i(n,r){n[r>>5]|=128<<r%32,n[14+(r+64>>>9<<4)]=r;var e,i,a,d,h,l=1732584193,g=-271733879,v=-1732584194,m=271733878;for(e=0;e<n.length;e+=16)i=l,a=g,d=v,h=m,g=f(g=f(g=f(g=f(g=c(g=c(g=c(g=c(g=u(g=u(g=u(g=u(g=o(g=o(g=o(g=o(g,v=o(v,m=o(m,l=o(l,g,v,m,n[e],7,-680876936),g,v,n[e+1],12,-389564586),l,g,n[e+2],17,606105819),m,l,n[e+3],22,-1044525330),v=o(v,m=o(m,l=o(l,g,v,m,n[e+4],7,-176418897),g,v,n[e+5],12,1200080426),l,g,n[e+6],17,-1473231341),m,l,n[e+7],22,-45705983),v=o(v,m=o(m,l=o(l,g,v,m,n[e+8],7,1770035416),g,v,n[e+9],12,-1958414417),l,g,n[e+10],17,-42063),m,l,n[e+11],22,-1990404162),v=o(v,m=o(m,l=o(l,g,v,m,n[e+12],7,1804603682),g,v,n[e+13],12,-40341101),l,g,n[e+14],17,-1502002290),m,l,n[e+15],22,1236535329),v=u(v,m=u(m,l=u(l,g,v,m,n[e+1],5,-165796510),g,v,n[e+6],9,-1069501632),l,g,n[e+11],14,643717713),m,l,n[e],20,-373897302),v=u(v,m=u(m,l=u(l,g,v,m,n[e+5],5,-701558691),g,v,n[e+10],9,38016083),l,g,n[e+15],14,-660478335),m,l,n[e+4],20,-405537848),v=u(v,m=u(m,l=u(l,g,v,m,n[e+9],5,568446438),g,v,n[e+14],9,-1019803690),l,g,n[e+3],14,-187363961),m,l,n[e+8],20,1163531501),v=u(v,m=u(m,l=u(l,g,v,m,n[e+13],5,-1444681467),g,v,n[e+2],9,-51403784),l,g,n[e+7],14,1735328473),m,l,n[e+12],20,-1926607734),v=c(v,m=c(m,l=c(l,g,v,m,n[e+5],4,-378558),g,v,n[e+8],11,-2022574463),l,g,n[e+11],16,1839030562),m,l,n[e+14],23,-35309556),v=c(v,m=c(m,l=c(l,g,v,m,n[e+1],4,-1530992060),g,v,n[e+4],11,1272893353),l,g,n[e+7],16,-155497632),m,l,n[e+10],23,-1094730640),v=c(v,m=c(m,l=c(l,g,v,m,n[e+13],4,681279174),g,v,n[e],11,-358537222),l,g,n[e+3],16,-722521979),m,l,n[e+6],23,76029189),v=c(v,m=c(m,l=c(l,g,v,m,n[e+9],4,-640364487),g,v,n[e+12],11,-421815835),l,g,n[e+15],16,530742520),m,l,n[e+2],23,-995338651),v=f(v,m=f(m,l=f(l,g,v,m,n[e],6,-198630844),g,v,n[e+7],10,1126891415),l,g,n[e+14],15,-1416354905),m,l,n[e+5],21,-57434055),v=f(v,m=f(m,l=f(l,g,v,m,n[e+12],6,1700485571),g,v,n[e+3],10,-1894986606),l,g,n[e+10],15,-1051523),m,l,n[e+1],21,-2054922799),v=f(v,m=f(m,l=f(l,g,v,m,n[e+8],6,1873313359),g,v,n[e+15],10,-30611744),l,g,n[e+6],15,-1560198380),m,l,n[e+13],21,1309151649),v=f(v,m=f(m,l=f(l,g,v,m,n[e+4],6,-145523070),g,v,n[e+11],10,-1120210379),l,g,n[e+2],15,718787259),m,l,n[e+9],21,-343485551),l=t(l,i),g=t(g,a),v=t(v,d),m=t(m,h);return[l,g,v,m]}function a(n){var t,r="",e=32*n.length;for(t=0;t<e;t+=8)r+=String.fromCharCode(n[t>>5]>>>t%32&255);return r}function d(n){var t,r=[];for(r[(n.length>>2)-1]=void 0,t=0;t<r.length;t+=1)r[t]=0;var e=8*n.length;for(t=0;t<e;t+=8)r[t>>5]|=(255&n.charCodeAt(t/8))<<t%32;return r}function h(n){return a(i(d(n),8*n.length))}function l(n,t){var r,e,o=d(n),u=[],c=[];for(u[15]=c[15]=void 0,o.length>16&&(o=i(o,8*n.length)),r=0;r<16;r+=1)u[r]=909522486^o[r],c[r]=1549556828^o[r];return e=i(u.concat(d(t)),512+8*t.length),a(i(c.concat(e),640))}function g(n){var t,r,e="";for(r=0;r<n.length;r+=1)t=n.charCodeAt(r),e+="0123456789abcdef".charAt(t>>>4&15)+"0123456789abcdef".charAt(15&t);return e}function v(n){return unescape(encodeURIComponent(n))}function m(n){return h(v(n))}function p(n){return g(m(n))}function s(n,t){return l(v(n),v(t))}function C(n,t){return g(s(n,t))}function A(n,t,r){return t?r?s(t,n):C(t,n):r?m(n):p(n)}"function"==typeof define&&define.amd?define(function(){return A}):"object"==typeof module&&module.exports?module.exports=A:n.md5=A}(this);
//# sourceMappingURL=md5.min.js.map

function newUser() {
	var university_id = parseInt($('#new_username').val());
	$('#new').css('display', 'block');
	if(isNaN(university_id)) {
		$('#NaN').css('visibility', 'visible');
		console.log('this b empty, yeet');
		return;
	}
	$('#NaN').css('visibility', 'hidden');

	axios.post('/checkUser', {
		username: university_id,
	}).then((res) => {
		if (res.data === false) {
			$('#invalidLogin').css('visibility', 'visible');
			return;
		} else {
			$('#invalidLogin').css('visibility', 'hidden');

		        var elementPosition = $('#position')[0];
      			var position = $('#position option:selected').text();
			app.user.position = position;
			app.user.university_id = university_id;

		        var passHash = md5($('#new_password').val());
		        var first_name = $('#firstName').val();
		        var last_name = $('#lastName').val();

		        axios.post('/data', {
		                university_id: university_id,
		                position: position,
		                password: passHash,
		                first_name: first_name,
		                last_name: last_name,
		        });

			var newBox = document.getElementById('new');
        		newBox.style.display = 'none';
			var box = document.getElementById('box');
		        box.style.display = 'none';
			var searchBox = document.getElementById('searchBox');
			searchBox.style.visibility = 'visible';
		}
	}).catch(err => {
                console.log(err);
        });
}

function logIn() {
	var username = parseInt($('#username').val());
	var password = $('#password').val();
	var passHash = md5(password);

	axios.post('/checkLogin', {
		username: username,
		password: passHash,
	}).then((res) => {
		if (res.data === false || res.data == 'false') {
			$('#invalidLogin').css('visibility', 'visible');
		} else {
		        $('#invalidLogin').css('visibility', 'hidden');

			app.user.position = res.data.position;
			app.updateUser(res.data.position);
			app.user.university_id = username;

			var newBox = document.getElementById('new');
                        newBox.style.display = 'none';
                        var searchBox = document.getElementById('searchBox');
                        searchBox.style.visibility = 'visible';
			var box = document.getElementById('box');
		        box.style.display = 'none';
		}
	}).catch(err => {
		console.log(err);
	});

	// Socket stuff
        socket = io();
        socket.on('connect', () => {
                console.log('Connection successful!');
        });
	socket.on('updateRegistered', (crn) => {
		console.log(crn);
		var el = $('div:contains("' + crn + '")');
		console.log(el);
	});
        /*socket.on('UpdateClientCount', (data) => {
                var client_count = document.getElementById('client_count');
                client_count.textContent = 'Number of clients: ' + data;
        });

        socket.on('ChatMessage', (data) => {
                var message = document.getElementById('message');
                var next = document.createElement('li');
                next.textContent = data;
                message.appendChild(next);
        });*/

}

function search() {

	$('#loader').css('display', 'block');
        setTimeout(stopLoading, 1000);

	app.courses = [];

	var departments = [];
	var course_number = $('#course_number').val();
	var crn = $('#crn').val();

	var checkedBoxes = document.querySelectorAll('input[class=checkboxes]:checked');
	checkedBoxes.forEach((node) => {
		departments.push(node.id);
	});

	axios.post('/searchData', {
		departments: departments,
		course_number: course_number,
		crn: crn
	}).then((res) => {
		for (var i = 0; i < res.data.length; i++) {
			for (var j = 0; j < res.data[i].length; j++) {

				// Calculate registered Count
                		var split = res.data[i][j].registered.split(',');
                		var courses = [];
                		for (var k = 0; k < split.length; k++) {
                        		if (split[k] != '' && split[k] != 'null') {
                                		if (split[k].includes('W')) {
                                        		courses.push(split[k].substring(1));
						} else {
                                        		courses.push(split[k]);
                                		}
                        		}
				}

				var registeredCount = courses.length;
				console.log(courses.length);

				app.courses.push({
					subject: res.data[i][j].subject,
					course_number: res.data[i][j].course_number,
					section_number: res.data[i][j].section_number,
					name: res.data[i][j].name,
					building: res.data[i][j].building,
					room: res.data[i][j].room,
					professors: res.data[i][j].professors,
					credits: res.data[i][j].credits,
					crn: res.data[i][j].crn,
					capacity: res.data[i][j].capacity,
					description: res.data[i][j].description,
					times: res.data[i][j].times,
					registered: res.data[i][j].registered,
					registeredCount: registeredCount,
					waitlist_count: res.data[i][j].waitlist_count,
				});
			}
		}
	}).then(() => {
		$('#courseTable tr').each((index, row) => {
			if (index != 0) {
				var crn = $(row).find('td')[8].innerHTML;
				var university_id = app.user.university_id;
				var course = '';

				for (var i = 0; i < app.courses.length; i++) {
                                	if (app.courses[i].crn == crn) {
                                        	course = app.courses[i];
                                	}
                        	}
				if (course.registered.includes('W' + university_id)) {
					row.style.backgroundColor = 'yellow';
				}
				else if (course.registered != null && course.registered.includes(university_id)) {
					row.style.backgroundColor = 'green';
				}
			}
		});

		$('#courseTable tr').click(function() {
			var error = document.getElementById('alreadyRegistered');
                        error.style.visibility = 'hidden';
			$('#timeConflict').css('visibility', 'hidden');

                	var additionalInfo = '';
			additionalInfo = additionalInfo + '';
			var crn = ($(this).find('td')[8].innerHTML);
			var course;

                        for (var i = 0; i < app.courses.length; i++) {
                                if (app.courses[i].crn == crn) {
                                        course = app.courses[i];
                                }
                        }

			if ($('#addInfo').length > 0) {
				$('#addInfo').remove();
			} else {
				additionalInfo = '<tr id="addInfo"><td colspan="12"><div> <p>Course Description</p> <p>' + course.description + '</p></div>';
				additionalInfo = additionalInfo + '<p>' + course.times  + '</p>';

				if (course.registered == null) {
					course.registered = 'null';
				}

console.log('info when choosing button: ' + course.registered);
console.log('ID: ' + app.user.university_id);
				if (app.user.position == 'Student' && course.registered != null && !course.registered.includes(app.user.university_id)) {
                                        additionalInfo = '<tr id="addInfo"><td colspan="12"> <br/> <button type="button" id="register" onclick="register(' + course.crn + ',' + course.capacity + ',' + '\'' + course.registered + '\'' + ',\'false\'' + ',' + course.waitlist_count + ')">Register</button>';
                                        additionalInfo = additionalInfo + '<div> <p> <b> Course Description: </b>' + course.description + '</p></div>';
                                        additionalInfo = additionalInfo + '<p> <b> Times: </b>' + course.times  + '</p> </td></tr>';
                                } else if (app.user.position == 'Student' && course.registered.includes(app.user.university_id)) {
                                        additionalInfo = '<tr id="addInfo"><td colspan="12"> <br/> <button type="button" id="drop" onclick="register(' + course.crn + ',' + course.capacity + ',\'' + course.registered + '\',true' + ',' + course.waitlist_count + ')">Drop</button>';
                                        additionalInfo = additionalInfo + '<div> <p>Course Description: ' + course.description + '</p></div>';
                                        additionalInfo = additionalInfo + '<p>' + course.times  + '</p> </td></tr>';
                                } else if (app.user.position.trim() == 'Faculty'){
                                        additionalInfo = '<tr id="addInfo"><td colspan="12"> <br/> <button type="button" id="roster" onclick="roster(' + course.crn + ')">Roster</button>';
                                        additionalInfo = additionalInfo + '<div> <p>Course Description: ' + course.description + '</p></div>';
                                        additionalInfo = additionalInfo + '<p>' + course.times  + '</p> </td></tr>';
                                } else {
                                        console.log('something is wrong: ' + app.user.position);
                                        additionalInfo = additionalInfo + '</td></tr>';
                                }

				$(additionalInfo).insertAfter(this);
			}
       		});

	}).catch(err => {
		console.log(err);
	});

	//socket.emit('updateRegistered', crn);
}

function register(crn, capacity, registered, drop, waitlist_count) {
	console.log('USERID: ' + app.user.university_id);
	axios.post('/register', {
		university_id: app.user.university_id,
		crn: crn,
		capacity: capacity,
		registered: registered,
		drop: drop,
		waitlist_count: waitlist_count,
	}).then((res) => {
		var registered = '';
		if (res.data == 'error') {
			var error = document.getElementById('alreadyRegistered');
                        error.style.visibility = 'visible';
		} else if (res.data == 'updated' || res.data == 'waitlisted') {
			var drop =  '<button type="button" id="drop" onclick="register(' + crn + ',' + capacity + ',\'' + registered + '\',\'true\'' + ',' + waitlist_count + ')">Drop</button></td></tr>';
			$('#register').replaceWith(drop);
		} else if (res.data == 'dropped') {
			var register = '<button type="button" id="register" onclick="register(' + crn + ',' + capacity + ',\'' + registered + '\',\'false\'' + ',' + waitlist_count + ')">Register</button></td></tr>';
			$('#drop').replaceWith(register);
		} else if (res.data == 'timeConflict') {
			$('#timeConflict').css('visibility', 'visible');
		} else {
			//console.log(res.data);
		}

		// Update colors?
		$('#courseTable tr').each((index, row) => {
                        if (index != 0) {
			    if ($(row).find('td').length === 12) {
                                var newcrn = $(row).find('td')[8].innerHTML;
                                var university_id = app.user.university_id;
                                var course = '';

                                for (var i = 0; i < app.courses.length; i++) {
                                        if (app.courses[i].crn == newcrn) {
                                                course = app.courses[i];
                                        }
                                }
console.log(res.data);
console.log(crn + ' ' + newcrn);
console.log('course-registered: ' + course.registered);
                                if (course.registered.includes('W' + university_id)) {
                                        row.style.backgroundColor = 'yellow';
                                } else if (crn == newcrn && res.data == 'updated') {
					row.style.backgroundColor = 'green';
				/*} else if (course.registered != null && course.registered.includes(university_id)) {
                                        row.style.backgroundColor = 'green';
                                	console.log('recolored'); */
				} else if (crn == newcrn && res.data == 'dropped') {
					row.style.backgroundColor = '#f2f2f2';
				} else if (crn == newcrn && res.data == 'waitlisted') {
					row.style.backgroundColor = 'yellow';
				} else if (course.registered.includes(university_id)) {
					row.style.backgroundColor = 'green';
				} else {
					row.style.backgroundColor = '#f2f2f2';
				}
			    }
                        }
                });

	}).catch(err => {
                console.log(err);
        });
}

function roster(crn) {
	axios.post('/roster', {
		crn: crn,
	}).then((res) => {
		var registered = res.data;
		if (registered.includes('null')) {
			registered = registered.substring(5);
		}
		registered = registered.replace(/(^,)|(,$)/g, "");
		alert('Students registered for this course: ' + registered);
	}).catch(err => {
                console.log(err);
        });
}

function goToProfile() {
	var newBox = document.getElementById('new');
        newBox.style.visibility = 'hidden';
        var searchBox = document.getElementById('searchBox');
        searchBox.style.visibility = 'hidden';
        var box = document.getElementById('box');
        box.style.visibility = 'hidden';
	$('#profile').css('display', 'block');
	$('#scheduleInfo').css('display', 'none');
	$('#viewWishlist').css('display', 'none');
}

function goToSearch() {
	$('#profile').css('display', 'none');
	$('#searchBox').css('visibility', 'visible');
}

function viewSchedule() {
	$('#scheduleInfo').css('display', 'block');
	$('#profile').css('display', 'none');

	axios.post('/getSchedule', {
		university_id: app.user.university_id,
	}).then(res => {
		for (var i = 0; i < res.data.length; i++) {
			for (var j = 0; j < res.data[i].length; j++) {
				var inArray = false;
				for (var k = 0; k < app.user.courses.length; k++) {
					if (res.data[i][j].crn == app.user.courses[k].crn) {
						inArray = true;
					}
				}
				if (!inArray) {
					app.user.courses.push(res.data[i][j]);
				}
			}
		}
	}).catch((err) => {
		console.log(err);
	});
}

function viewWishlist() {
	$('#viewWishlist').css('display', 'block');
	$('#profile').css('display', 'none');
}

function dropFromSchedule(crn) {
	if ($('#scheduleDrop').length) {
		var register = '<button type="button" id="scheduleRegister" onclick="dropFromSchedule()">Register</button>';
		$('#scheduleDrop').replaceWith(register);
	} else if ($('#scheduleRegister').length){
		var drop = '<button type="button" id="scheduleDrop" onclick="dropFromSchedule()">Drop</button>';
		$('#scheduleRegister').replaceWith(drop)
	}
}
