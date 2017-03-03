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

EventEmitter.prototype.registerHandler = function(event, handler) {
	if (this.eventSafe && !this.hasEvent(event)) {
		console.warn('This emitter is event safe and does not support the event name: ' + event + '.');
		return null;
	} else if (typeof handler !== 'function') {
		console.warn('The handler must be a function.');
		return null;
	}

	if (!this.handlers.event) {
		this.handlers.event = [];
	} else if (this.handlers.event.indexOf(handler) > -1) {
		console.warn('This handler is already registered for this event.');
		return null;
	}

	this.handlers.event.push(handler);

	return new HandlerBundle(event, handler, this);
}

module.exports = EventEmitter;