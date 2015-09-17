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
		var passed = false;
		app.use(function (req, res, next) {
			passed = true;
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
				assert.ok(passed);
				done();
			});
	});

	it('should not called middleware when res.render not called', function (done) {
		var app = express();
		var passed = false;
		app.use(onRender.create(function (req, res, rendering, view, options) {
			passed = true;
		}));
		app.set('views', path.join(__dirname, 'views'));
		app.set('view engine', 'jade');
		app.get('/', function (req, res) {
			res.send('ok');
		})

		request.agent(app)
			.get('/')
			.expect(200)
			.end(function () {
				assert.ok(!passed);
				done();
			});
	});

	it('should called middleware when res.render called', function (done) {
		var app = express();
		var passed = false;
		app.use(onRender.create(function (req, res, rendering, view, options) {
			assert.strictEqual(rendering, renderContent);
			assert.strictEqual(view, template);
			passed = true;
		}));
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
				assert.ok(passed);
				done();
			});
	});

	it('should return options with rendering opts', function (done) {
		var app = express();
		var passed = false;
		var opt = { foo: 'baaaaaaaa' };
		app.use(onRender.create(function (req, res, rendering, view, options) {
			assert.strictEqual(rendering, renderContent);
			assert.strictEqual(view, template);
			assert.strictEqual(options.foo, opt.foo);
			passed = true;
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
				assert.ok(passed);
				done();
			});
	});
});
