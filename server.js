var express = require('express');
var app = require("./wrio_app.js").init(express);
var server = require('http').createServer(app).listen(5001);
var fs = require('fs');
var wrioLogin = require('./wriologin')

var titterPicture = require('./titter-picture');
var titterSender = require('./titter-sender');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
	response.render('index.ejs');
})


app.post('/sendComment', function (request, response) {
	try {
		var imageFileData = request.body.fileData;
		var message = request.body.comment;
		var ssid = request.body.ssid;
		wrioLogin.getTwitterCredentials(ssid, function (err,cred) {
			if (err) {
				console.log ("Twitter auth failed");
			} else {
				console.log("got keys",cred);
				titterPicture.drawComment(imageFileData, function (error, data) {
					var imagePath = "./images/temp.png";
					titterSender.comment(cred, message+' Donate 0 WRG', imagePath);
				});
			}
		});

	} catch (error) {
		console.log(error);
	} finally {
		response.send('Done');
		response.end()
	}
});
console.log("Application Started!");