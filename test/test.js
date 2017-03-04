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
		expect(result.event).to.equal(event);
		expect(result.handler).to.equal(handler);
		expect(result.emitter).to.equal(emitter);
	});
});

describe('#RegisterOneTimeHandler', function() {
	it('should not register a handler if the handler is not a function', function() {
		let emitter = new EventEmitter([]);
		let result = emitter.registerOneTimeHandler('foo', 'bar');
		expect(result).to.equal(null);
	});

	it('should call the handler once and only once when the event is emitted', function() {
		let emitter = new EventEmitter([]);
		let called = 0;
		let event = 'foo';
		let handler = function(){
			called++;
		};

		emitter.registerOneTimeHandler(event, handler);
		emitter.emitEvent(event);
		emitter.emitEvent(event);

		expect(called).to.equal(1);
	});
});

describe('#RemoveHandler', function() {
	it('should return false if a handler is removed that was not registered', function() {
		let emitter = new EventEmitter([]);
		expect(emitter.removeHandler('test', function(){})).to.be.false;
	});

	it('should return true and no longer call the handler if removed', function() {
		let emitter = new EventEmitter([]);
		let called = 0;
		let event = 'foo';
		let handler = function(){
			called++;
		};

		emitter.registerHandler(event, handler);
		emitter.emitEvent(event);
		expect(called).to.equal(1);

		expect(emitter.removeHandler(event, handler)).to.be.true;
		emitter.emitEvent(event);
		expect(called).to.equal(1);
	});
});

describe('#EmitEvent', function() {
	it('should not emit an event if it is event safe and does not have the event', function() {
		let emitter = new EventEmitter([], true);
		expect(emitter.emitEvent('test')).to.be.false;
	});

	it('should emit an event if it is not event safe', function() {
		let emitter = new EventEmitter([], false);
		expect(emitter.emitEvent('test')).to.be.true;
	});

	it('should emit an event if it has the event', function() {
		let emitter = new EventEmitter(['test'], true);
		expect(emitter.emitEvent('test')).to.be.true;
	});

	it('should call an event handler if it is registered', function() {
		let emitter = new EventEmitter(['test'], true);
		var called = 0;

		emitter.registerHandler('test', function(){
			called++;
		});
		emitter.emitEvent('test');

		expect(called).to.equal(1);
	});

	it('should call an event handler as many times as the event is emitted', function() {
		let emitter = new EventEmitter(['test'], true);
		var called = 0;

		emitter.registerHandler('test', function(){
			called++;
		});
		emitter.emitEvent('test');
		emitter.emitEvent('test');

		expect(called).to.equal(2);
	});

	it('should call multiple event handlers if they are registered', function() {
		let emitter = new EventEmitter(['test'], true);
		var called = 0;

		emitter.registerHandler('test', function(){
			called++;
		});
		emitter.registerHandler('test', function(){
			called++;
		});

		emitter.emitEvent('test');

		expect(called).to.equal(2);
	});
});

describe('#EventArguments', function() {
	it('should pass all emitEvent arguments to handlers', function() {
		let emitter = new EventEmitter();
		let event = 'foo';
		let args = [];
		let handler = function(...rest){
			args = rest;
		};

		emitter.registerHandler(event, handler);

		emitter.emitEvent(event, 1, 2, 3, 'foo');
		expect(args).to.eql([1, 2, 3, 'foo']);

		emitter.emitEvent(event, 'foo', 'bar');
		expect(args).to.eql(['foo', 'bar']);

		emitter.emitEvent(event);
		expect(args).to.eql([]);
	});

	it('should pass same arguments to seperate handlers', function() {
		let emitter = new EventEmitter();
		let event = 'foo';
		let val1 = 0;
		let val2 = 0;
		let handler1 = function(val){
			val1 = val + 1;
		};

		let handler2 = function(val){
			val2 = val - 1;
		};

		emitter.registerHandler(event, handler1);
		emitter.registerHandler(event, handler2)

		emitter.emitEvent(event, 1);
		expect(val1).to.eql(val2 + 2);
	});

	it('should pass arguments to one time handlers properly', function() {
		let emitter = new EventEmitter();
		let event = 'foo';
		let args1 = [];
		let args2 = [];
		let handler1 = function(...rest){
			args1 = rest;
		};
		let handler2 = function(...rest){
			args2 = rest;
		};

		emitter.registerHandler(event, handler1);
		emitter.registerOneTimeHandler(event, handler2);

		emitter.emitEvent(event, 1, 2, 3, 'foo');
		expect(args1).to.eql(args2);

		emitter.emitEvent(event, 'foo', 'bar');
		expect(args1).to.not.eql(args2);
		expect(args1).to.eql(['foo', 'bar']);
		expect(args2).to.eql([1, 2, 3, 'foo']);
	});
});


















