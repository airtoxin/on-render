module.exports = {
	create: function (listenerFunc) {
		return function (req, res, next) {
			var prevRender = req.app.render;
			if (req.app.__on_render_injected__) return next();
			req.app.__on_render_injected__ = 1;
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
