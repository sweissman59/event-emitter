'use strict';

var HandlerBundle = require('./handlerBundle.js');

function EventEmitter(supportedEvents, eventSafe) {
	this.supportedEvents = [];
	this.eventSafe = eventSafe !== undefined ? eventSafe : false;
	this.handlers = {};

	if (Array.isArray(supportedEvents) && supportedEvents.length > 0) {
		this.supportedEvents = supportedEvents;
	}
}

EventEmitter.prototype.getEvents = function() {
	return this.supportedEvents;
}

EventEmitter.prototype.hasEvent = function(event) {
	return this.supportedEvents.indexOf(event) > -1;
}

EventEmitter.prototype.checkSafety = function(event) {
	if (this.eventSafe && !this.hasEvent(event)) {
		return false;
	}

	return true;
}

function checkFunction(func) {
	if (typeof func !== 'function') {
		return false;
	}

	return true;
}

EventEmitter.prototype.registerHandler = function(event, handler) {
	if (!this.checkSafety(event)) {
		console.warn('This emitter is event safe and does not support the event name: ' + event + '.');
		return null;
	} else if (!checkFunction(handler)) {
		console.warn('The handler must be a function.');
		return null;
	}

	if (!this.handlers[event]) {
		this.handlers[event] = [];
	} else if (this.handlers[event].indexOf(handler) > -1) {
		console.warn('This handler is already registered for this event.');
		return null;
	}

	this.handlers[event].push(handler);

	return new HandlerBundle(event, handler, this);
}

EventEmitter.prototype.registerOneTimeHandler = function(event, handler) {
	if (!checkFunction(handler)) {
		console.warn('The handler must be a function.');
		return null;
	}

	let self = this;
	let handlerWrapper = function(...rest) {
		handler(...rest);
		self.removeHandler(event, handlerWrapper);
	}

	let handlerBundle = this.registerHandler(event, handlerWrapper);

	if (handlerBundle === null) return null;

	return handlerBundle;
}

EventEmitter.prototype.removeHandler = function(event, handler) {
	let eventHandlers = this.handlers[event];

	if (eventHandlers) {
		let idx = eventHandlers.indexOf(handler);

		if (idx > -1) {
			eventHandlers.splice(idx, 1);
			return true;
		}
	}

	return false;
}

EventEmitter.prototype.removeAllEventHandlers = function(event) {
	delete this.handlers[event];
}

EventEmitter.prototype.removeAllHandlers = function() {
	this.handlers = {};
}

EventEmitter.prototype.emitEvent = function(event, ...rest) {
	if (!this.checkSafety(event)) {
		console.warn('This emitter is event safe and does not support the event name: ' + event + '.');
		return false;
	}

	let eventHandlers = this.handlers[event];

	if (eventHandlers) {
		for (let i = 0; i < eventHandlers.length; i++) {
			eventHandlers[i].apply(this, rest);
		}
	}

	return true;
}

module.exports = EventEmitter;