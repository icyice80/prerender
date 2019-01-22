const util = require('../util.js');

const redis_url = process.env.REDISTOGO_URL || process.env.REDISCLOUD_URL || process.env.REDISGREEN_URL || process.env.REDIS_URL,
	url = require('url'),
	ttl = process.env.PAGE_TTL || 86400;


// Parse out the connection vars from the env string.
let connection = url.parse(redis_url),
	redis = require('redis'),
	client = redis.createClient(connection.port, connection.hostname),
	redis_online = false,
	last_error = "",
	last_end_message = ""; // Make redis connection

// Parse out password from the connection string
if (connection.auth) {
	client.auth(connection.auth.split(":")[1]);
}

// Catch all error handler. If redis breaks for any reason it will be reported here.
client.on("error", function (err) {
	if (last_error === err.toString()) {
		// Swallow the error for now
	} else {
		last_error = err.toString();
		console.warn("Redis Cache Error: " + err);
	}
});
//
client.on("ready", function () {
	redis_online = true;
	util.log(`Redis Cache Connected -- ${redis_url}`);
});

client.on("end", function (err) {
	if (err) {
		err = err.toString();
		if (last_end_message == err) {
			// Swallow the error for now
		} else {
			last_end_message = err;
			redis_online = false;
			util.log("Redis Cache Conncetion Closed. Will now bypass redis until it's back.");
		}
	}
});

module.exports = {
	requestReceived: function (req, res, next) {

		if (req.method !== 'GET' || redis_online !== true) {
			return next();
		}

		if (req.headers && req.headers['x-prerender-cache']) {
			return next();
		}

		client.get(req.prerender.url, function (err, result) {
			// Page found - return to prerender and 200
			if (!err && result) {
				util.log(`cache record found for ${req.prerender.url}`);
				req.prerender.fromCache = true;
				res.send(200, result);
			} else {
				next();
			}
		});
	},

	beforeSend: function (req, res, next) {
		if (redis_online !== true || req.prerender.fromCache === true) {
			return next();
		}

		if (req.prerender.content) {
			const statusMatch = /<meta[^<>]*(?:name=['"]prerender-status-code['"][^<>]*content=['"]([0-9]{3})['"]|content=['"]([0-9]{3})['"][^<>]*name=['"]prerender-status-code['"])[^<>]*>/i;
			const head = req.prerender.content.toString().split('</head>', 1).pop();
			let statusCode = 200;
			let match;

			if (match = statusMatch.exec(head)) {
				statusCode = match[1] || match[2];
			}

			// Don't cache anything that didn't result in a 200. This is to stop caching of 3xx/4xx/5xx status codes
			if (req.prerender.statusCode === 200 && statusCode === 200) {
				client.set(req.prerender.url, req.prerender.content.toString(), function (err, reply) {
					util.log(`cache record saved for ${req.prerender.url}`);
					// If library set to cache set an expiry on the key.
					if (!err && reply && ttl && ttl != 0) {
						client.expire(req.prerender.url, ttl, function (err, didSetExpiry) {
							util.log(!!didSetExpiry);
						});
					}
				});
			}
		}
		next();
	}
};