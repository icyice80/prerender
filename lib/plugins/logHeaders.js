const util = require('../util.js');

const noLoggingResources = [
    ".ttf",
    ".eot",
    ".otf",
    ".woff",
    ".png",
    ".gif",
    ".tiff",
    ".pdf",
    ".jpg",
    ".jpeg",
    ".ico"
];


module.exports = {
    requestReceived: function (req, res, next) {
        if (req.headers) {
            let log = true;
            noLoggingResources.forEach((substring) => {
                if (req.url.indexOf(substring) >= 0) {
                    log = false;
                }
            });
            if (log) {
                util.log(req.headers);
            }
        }

        next();
    }
}