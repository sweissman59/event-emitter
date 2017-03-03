'use strict';

var expect = require('chai').expect;
var EventEmitter = require('../index.js');

describe('#Constructor', function() {
	it('should be event safe if constructed with eventSafe true', function () {
		let emitter = new EventEmitter([], true);
		expect(emitter.eventSafe).to.equal.true;
	});

	it('should not be event safe if constructed with eventSafe false', function () {
		let emitter = new EventEmitter([], false);
		expect(emitter.eventSafe).to.equal.false;
	});

	it('should not be event safe if constructed with eventSafe null', function () {
		let emitter = new EventEmitter([]);
		expect(emitter.eventSafe).to.equal.false;
	});

	it('should have supported events if passed non-empty array', function() {
		let emitter = new EventEmitter(['test']);
		expect(emitter.getEvents()).to.have.lengthOf(1);
		expect(emitter.getEvents()[0]).to.equal('test');
	});

	it('should not have supported events if passed empty array', function () {
		let emitter = new EventEmitter([]);
		expect(emitter.getEvents()).to.have.lengthOf(0);
	});

	it('should not have supported events if passed nothing', function () {
		let emitter = new EventEmitter();
		expect(emitter.getEvents()).to.have.lengthOf(0);
	});
});

describe('#HasEvent', function() {
	it('should return false if it does not have the event', function () {
		let emitter = new EventEmitter(['test']);
		expect(emitter.hasEvent('foo')).to.be.false;
	});
	it('should return true if it has the event', function () {
		let emitter = new EventEmitter(['test']);
		expect(emitter.hasEvent('test')).to.be.true;
	});
});

describe('#RegisterHandler', function() {
	it('should not register a handler if it is event safe and does not have the event', function() {
		let emitter = new EventEmitter([], true);
		let result = emitter.registerHandler('foo', function(){});
		expect(result).to.equal(null);
	});

	it('should not register a handler if the handler is not a function', function() {
		let emitter = new EventEmitter([]);
		let result = emitter.registerHandler('foo', 'bar');
		expect(result).to.equal(null);
	});

	it('should return a HandlerBundle containing the event, handler, and emitter', function() {
		let emitter = new EventEmitter([]);
		let event = 'foo';
		let handler = function(){};
		let result = emitter.registerHandler(event, handler);
		expect(result.event).to.eql(event);
		expect(result.handler).to.eql(handler);
		expect(result.emitter).to.eql(emitter);
	});
});