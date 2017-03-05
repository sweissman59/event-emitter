'use strict';

var HandlerBundle = require('./handlerBundle.js');

/**
 * Creates an instance of EventEmitter.
 *
 * @constructor
 * @param      {Array}   supportedEvents  The supported events for the EventEmitter
 * @param      {boolean} eventSafe        Whether the EventEmitter should enforce its supported events for registerHandler and emitEvent
 */
function EventEmitter(supportedEvents, eventSafe) {
	this.supportedEvents = [];
	this.eventSafe = eventSafe !== undefined ? eventSafe : false;
	this.handlers = {};

	if (Array.isArray(supportedEvents) && supportedEvents.length > 0) {
		this.supportedEvents = supportedEvents;
	}
}

/**
 * Gets the EventEmitter's supported events.
 *
 * @return     {Array}  The supported events.
 */
EventEmitter.prototype.getEvents = function() {
	return this.supportedEvents;
}

/**
 * Determines if the EventEmitter supports a specific event.
 *
 * @param      {string}   event   The event to check
 * @return     {boolean}  True if has event, False otherwise.
 */
EventEmitter.prototype.hasEvent = function(event) {
	return this.supportedEvents.indexOf(event) > -1;
}

/**
 * Checks if the event is safe (either no event safety, or supports the event).
 *
 * @param      {string}   event   The event to check
 * @return     {boolean}  True if the event can be considered safe, False otherwise.
 */
EventEmitter.prototype.checkSafety = function(event) {
	if (this.eventSafe && !this.hasEvent(event)) {
		return false;
	}

	return true;
}

/**
 * Checks if the argument is a function.
 *
 * @param      {<type>}   func    The variable to check
 * @return     {boolean}  True if the argument is a function, False otherwise.
 */
function checkFunction(func) {
	if (typeof func !== 'function') {
		return false;
	}

	return true;
}

/**
 * Registers a handler function for an event, if that event is supported or if event safety isn't enabled.
 *
 * @param      {string}         event    The event for which to register the handler.
 * @param      {Function}       handler  The handler for the event.
 * @return     {HandlerBundle}  A HandlerBundle containing the event, handler, and EventEmitter, for easy removal. Null if registering failed.
 */
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

/**
 * Registers a handler function for an event that will only be called once (event safety enforced).
 * The passed in handler is wrapped in a new function that takes care of removing the handler once it is
 * called. Arguments are passed through.
 *
 * @param      {string}          event    The event
 * @param      {Function}        handler  The handler
 * @return     {HandlerBundle}   A HandlerBundle containing the event, handler, and EventEmitter, for easy removal. Null if registering failed.
 */
EventEmitter.prototype.registerOneTimeHandler = function(event, handler) {
	if (!checkFunction(handler)) {
		console.warn('The handler must be a function.');
		return null;
	}

	let self = this;

	let handlerBundle = this.registerHandler(event, function(...rest){
		handlerBundle.remove();
		handler(...rest);
	});

	if (handlerBundle === null) return null;
	return handlerBundle;
}

/**
 * Removes a handler.
 *
 * @param      {string}     event    The event for which to remove the handler
 * @param      {Function}   handler  The handler to remove
 * @return     {boolean}    True if a handler was removed, False otherwise (trying to remove a handler that wasn't registered).  
 */
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

/**
 * Removes all event handlers for a specific event.
 *
 * @param      {string}  event   The event for which to remove the handlers.
 */
EventEmitter.prototype.removeAllEventHandlers = function(event) {
	delete this.handlers[event];
}

/**
 * Removes all handlers for all events.
 */
EventEmitter.prototype.removeAllHandlers = function() {
	this.handlers = {};
}

/**
 * Emits an event by calling all registered handlers for that event, and passing the arguments to each of them.
 *
 * @param      {string}   event   The event to emit
 * @param      {Array}    rest    The arguments to pass to the handlers
 * @return     {boolean}  True if the event is supported or if event safety isn't enabled, False otherwise.
 */
EventEmitter.prototype.emitEvent = function(event, ...rest) {
	if (!this.checkSafety(event)) {
		console.warn('This emitter is event safe and does not support the event name: ' + event + '.');
		return false;
	}

	let eventHandlers = this.handlers[event];

	if (eventHandlers) {
		eventHandlers = eventHandlers.slice();
		for (let i = 0; i < eventHandlers.length; i++) {
			eventHandlers[i].apply(this, rest);
		}
	}

	return true;
}

module.exports = EventEmitter;