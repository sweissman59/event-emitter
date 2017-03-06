# swh-event-emitter
A simple event emitter package which allows for registering handlers for
events, registering one time handlers, emitting events, and removing handlers.

# Installation
```
npm install swh-event-emitter
```

#Usage
```javascript
var EventEmitter = require('swh-event-emitter');

// EventEmitter can be limitted to supported events by providing an
// array of supported event names, and True for the event safe arg.
var emitter = new EventEmitter(['event1', 'event2'], true);

// Should issue a warning for trying to emit an unsupported event.
emitter.emitEvent('unsupportedEvent');

// Should issue a warning for trying to register a handler for an
// unsupported event.
emitter.registerHandler('unsupportedEvent', function(){});

// Should return the array of supported events.
emitter.getEvents();

// Should return True.
emitter.hasEvent('event1');

var handler = function(...rest) {
	console.log('Handler for event1 called with args: ' + JSON.stringify(rest));
}
var handlerBundle = emitter.registerHandler('event1', handler);
emitter.emitEvent('event1', 1, 'foo', {bar: 1}, ['blah', 'hooray']);

// Remove handler using the same event name and handler reference.
emitter.removeHandler('event1', handler);

// The HandlerBundle object returned when registering a handler allows for easy removal
// later without storing the event name, handler function, and emitter separately.
handlerBundle.remove();

// A one time event will be called at most one time. Like normal handlers they can be
// removed at any time.
emitter.registerOneTimeHandler('event1', handler);
emitter.emitEvent('event1', 'test');

// The handler shouldn't be called again here.
emitter.emitEvent('event1', 'test');

// Remove all handlers for a single event.
emitter.removeAllEventHandlers('event1');

// Remove all handlers for all events.
emitter.removeAllHandlers();
```

#Tests
Clone this repository, then from the directory run
```
npm test
```
Test results will print to the console, with additional code coverage available in the `coverage` directory.