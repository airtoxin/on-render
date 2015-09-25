var path = require('path');
var assert = require('assert');
var http = require('http');
var request = require('supertest');
var express = require('express');
var onRender = require('..');

var template = 'index.jade';
var renderContent = '<test></test>';

describe('create', function () {
	it('default behavior', function (done) {
		var app = express();
		var passCount = 0;
		app.use(function (req, res, next) {
			passCount++;
			next();
		});
		app.set('views', path.join(__dirname, 'views'));
		app.set('view engine', 'jade');
		app.get('/', function (req, res) {
			res.render(template);
		})

		request.agent(app)
			.get('/')
			.expect(renderContent)
			.expect(200)
			.end(function () {
				assert.strictEqual(passCount, 1);
				done();
			});
	});

	it('should not called on-render middleware when res.render not called', function (done) {
		var app = express();
		var passCount = 0;
		app.use(onRender.create(function (req, res, rendering, view, options) {
			passCount++;
		}));
		var mark = null;
		app.use(function (req, res, next) {
			passCount++;
			mark = req.app.__on_render_injected__;
			next();
		})
		app.set('views', path.join(__dirname, 'views'));
		app.set('view engine', 'jade');
		app.get('/', function (req, res) {
			res.send('ok');
		})

		request.agent(app)
			.get('/')
			.expect(200)
			.end(function () {
				assert.strictEqual(passCount, 1);
				assert.strictEqual(mark, 1);
				done();
			});
	});

	it('should called on-render middleware when res.render called', function (done) {
		var app = express();
		var passCount = 0;
		app.use(onRender.create(function (req, res, rendering, view, options) {
			assert.strictEqual(rendering, renderContent);
			assert.strictEqual(view, template);
			passCount++;
		}));
		var mark = null;
		app.use(function (req, res, next) {
			passCount++;
			mark = req.app.__on_render_injected__;
			next();
		})
		app.set('views', path.join(__dirname, 'views'));
		app.set('view engine', 'jade');
		app.get('/', function (req, res) {
			res.render(template);
		})

		request.agent(app)
			.get('/')
			.expect(renderContent)
			.expect(200)
			.end(function () {
				assert.strictEqual(passCount, 2);
				assert.strictEqual(mark, 1);
				done();
			});
	});

	it('should return options with rendering opts', function (done) {
		var app = express();
		var passCount = 0;
		var opt = { foo: 'baaaaaaaa' };
		app.use(onRender.create(function (req, res, rendering, view, options) {
			assert.strictEqual(rendering, renderContent);
			assert.strictEqual(view, template);
			assert.strictEqual(options.foo, opt.foo);
			passCount++;
		}));
		app.set('views', path.join(__dirname, 'views'));
		app.set('view engine', 'jade');
		app.get('/', function (req, res) {
			res.render(template, opt);
		})

		request.agent(app)
			.get('/')
			.expect(renderContent)
			.expect(200)
			.end(function () {
				assert.strictEqual(passCount, 1);
				done();
			});
	});
});
