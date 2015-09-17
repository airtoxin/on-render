module.exports = {
	create: function (listenerFunc) {
		return function (req, res, next) {
			var prevRender = req.app.render;
			req.app.render = function (view, options, callback) {
				var newCallback = function (err, str) {
					listenerFunc(req, res, str, view, options);
					callback.apply(this, arguments);
				};
				prevRender.call(this, view, options, newCallback);
			};
			next();
		};
	}
};
