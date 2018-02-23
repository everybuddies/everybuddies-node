var router = require('express').Router();

module.exports = function (parentRouter) {
    router.get('/', function (req, res) {
        var promises = []
        res.reply(Promise.all(promises));
    });
    parentRouter.use('/v1', router);
};