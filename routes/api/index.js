var router = require('express').Router();

function authToken(req, res, next) {
    req.use = {
        email: 'hencohen83@gmail.com'
    }
    next();

}
// route: /api
module.exports = function (parentRouter) {
    require('./v1')(router);
    parentRouter.use('/api', authToken, router);
};