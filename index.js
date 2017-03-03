'use strict';

function EventEmitter(supportedEvents, eventSafe) {
	this.supportedEvents = [];
	this.eventSafe = eventSafe !== undefined ? eventSafe : false;
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

module.exports = EventEmitter;