'use strict';

var expect = require('chai').expect;
var EventEmitter = require('../index.js');

describe('#EventEmitterConstructor', function() {
	it('should be event safe if constructed with eventSafe true', function () {
		var emitter = new EventEmitter([], true);
		expect(emitter.eventSafe).to.equal.true;
	});

	it('should not be event safe if constructed with eventSafe false', function () {
		var emitter = new EventEmitter([], false);
		expect(emitter.eventSafe).to.equal.false;
	});

	it('should not be event safe if constructed with eventSafe null', function () {
		var emitter = new EventEmitter([]);
		expect(emitter.eventSafe).to.equal.false;
	});

	it('should have supported events if passed non-empty array', function() {
		var emitter = new EventEmitter(['test']);
		expect(emitter.getEvents()).to.have.lengthOf(1);
		expect(emitter.getEvents()[0]).to.equal('test');
	});

	it('should not have supported events if passed empty array', function () {
		var emitter = new EventEmitter([]);
		expect(emitter.getEvents()).to.have.lengthOf(0);
	});

	it('should not have supported events if passed nothing', function () {
		var emitter = new EventEmitter();
		expect(emitter.getEvents()).to.have.lengthOf(0);
	});
});

describe('#EventEmitterHasEvent', function() {
	it('should return false if it does not have the event', function () {
		var emitter = new EventEmitter(['test']);
		expect(emitter.hasEvent('foo')).to.be.false;
	});
	it('should return true if it has the event', function () {
		var emitter = new EventEmitter(['test']);
		expect(emitter.hasEvent('test')).to.be.true;
	});
});