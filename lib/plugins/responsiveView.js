module.exports = {
	requestReceived: function (req, res, next) {
		req.prerender.width = 375;
		// if (req.headers && req.headers['x-viewport-width']) {
		// 	var newWidth = parseInt(req.headers['x-viewport-width']);
		// 	if (!isNaN(newWidth) && newWidth > 0) {
		// 		req.prerender.width = newWidth;
		// 		util.log(`responsiveViewPort width is ${req.prerender.width}`);
		// 	}
		// }
		// if (req.headers && req.headers['x-viewport-height']) {
		// 	var newHeight = parseInt(req.headers['x-viewport-height']);
		// 	if (!isNaN(newHeight) && newHeight > 0) {
		// 		req.prerender.height = newHeight;
		// 		util.log(`responsiveViewPort height is ${req.prerender.height}`);
		// 	}
		// }
		next();
	}
}