const util = require('../util.js');

module.exports = {
    requestReceived: function (req, res, next) {
        if (req.headers) {
            util.log(req.headers);
        }

        next();
    }
}