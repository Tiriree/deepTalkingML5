// quick and dirty express / websocket / osc demo.
// gets p5.SpeechRec data and forwards to OSC client.

var http = require('http');
var express = require('express');

var port = 3080;//change back to 3080 for nginx
var ejs = require('ejs');

const DEBUG = true; // print stuff out

var app = module.exports.app = express();

app.use(express.static(__dirname+'/public'));
app.engine('.html', ejs.__express);
app.set('view-engine', 'html');
var server = http.createServer(app); // web server

server.listen(port);  // start
console.log("Listening on port: "+ port);
// get data from web client (e.g. Chrome), forward on to OSC client (e.g. Max)

app.get("/",function(req,res){
	res.render("indexML.html");
});
