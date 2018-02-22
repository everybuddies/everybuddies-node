var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var config = global.config = require('./config.js');
var port = config.port;
var initRootRouter = require('./routes')();

app.use(express.static(__dirname + '/../dist'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(initRootRouter);

var server = app.listen(port, function () {
    console.log('App listening on port %s', server.address().port);
});