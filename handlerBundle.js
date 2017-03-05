'use strict';

function HandlerBundle(event, handler, emitter) {
	this.event = event;
	this.handler = handler;
	this.emitter = emitter;
}

HandlerBundle.prototype.remove = function() {
	return this.emitter.removeHandler(this.event, this.handler);
}

module.exports = HandlerBundle;