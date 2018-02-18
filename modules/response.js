var statusSuccess = 200;
var statusError = 400;
var statusErrorAuth = 401;

function response(req, res) {
    return {
        reply: function (promise) {
            promise.then(
                function (successData) {
                    return res.status(statusSuccess).json(successData);
                }, function (errorData) {
                    return res.status(statusError).json(errorData);
                });
        },
        success: function (data) {
            return res.status(statusSuccess).json(data);
        },
        error: function (data) {
            return res.status(statusError).json(data);
        },
        authError: function (data) {
            return res.status(statusErrorAuth).json(data);
        }
    };
}

module.exports = response;