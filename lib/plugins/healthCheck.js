const util = require('../util.js');

module.exports = {
	requestReceived: (req, res, next) => {
		if (req.prerender.url === ""){
			util.log("health checked");
			res.send(200);
		}
		next();
	}
};