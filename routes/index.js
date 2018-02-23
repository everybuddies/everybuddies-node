var router = require('express').Router();
var response = require('modules/response.js');
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token, x-access-id');
    res.reply = response(req, res, next).reply;
    next();
};

module.exports = function () {
    router.use(allowCrossDomain);
    require('routes/api')(router);

    return router;
};