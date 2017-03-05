'use strict';

/**
 * Creates an instance of HandlerBundle
 *
 * @constructor
 * @param      {string}        event    The event the handler is for
 * @param      {Function}      handler  The handler for the event
 * @param      {EventEmitter}  emitter  The EventEmitter to which the event and handler belong.
 */
function HandlerBundle(event, handler, emitter) {
	this.event = event;
	this.handler = handler;
	this.emitter = emitter;
}

/**
 * Removes the associated handler from the associated EventEmitter for the associated event.
 *
 * @return     {boolean}  True if the handler was removed, False otherwise (if it was already removed)
 */
HandlerBundle.prototype.remove = function() {
	return this.emitter.removeHandler(this.event, this.handler);
}

module.exports = HandlerBundle;