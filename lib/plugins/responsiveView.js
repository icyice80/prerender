const util = require('../util.js');

module.exports = {
	requestReceived: function (req, res, next) {

		if (req.headers && req.headers['x-viewport-width'] && req.headers['x-viewport-height']) {

			var newWidth = parseInt(req.headers['x-viewport-width']);
			var newHeight = parseInt(req.headers['x-viewport-height']);

			if (!isNaN(newWidth) && !isNaN(newHeight) && newWidth > 0 && newHeight > 0) {
				req.prerender.width = newWidth;
				req.prerender.height = newHeight;
				util.log(`responsiveViewPort width is ${req.prerender.width}`);
				util.log(`responsiveViewPort height is ${req.prerender.height}`);
			}
		}
		next();
	}
}