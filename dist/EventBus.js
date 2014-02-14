/**
 * EventBus Module
 * Copyright (c) 2012-2013 Adam Ranfelt
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.EventBus = factory();
  }
}(this, function () {
    'use strict';

    /**
     * Index to indicate that an element was not found
     *
     * @property NOT_FOUND_INDEX
     * @type {number}
     * @final
     * @static
     */
    var NOT_FOUND_INDEX = -1;

/**
 * Function.bind & Array.indexOf Polyfill
 * Copyright (c) 2013 Adam Ranfelt
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */

if (typeof Array.prototype.indexOf !== 'function') {
    Array.prototype.indexOf = function indexOf(searchElement, fromIndex) {
        var length = this.length;
        // Don't search if there isn't a length
        if (!length) {
            return -1;
        }

        // Convert and transfer the number to 0
        fromIndex = Number(fromIndex);
        if (typeof fromIndex !== 'number' || isNaN(fromIndex)) {
            fromIndex = 0;
        }

        // If the search index goes beyond the length, fail
        if (fromIndex >= length) {
            return -1;
        }

        // If the index is negative, search that many indices from the length
        if (fromIndex < 0) {
            fromIndex = length - Math.abs(fromIndex);
        }

        // Search for the index
        var i;
        for (i = fromIndex; i < length; i++) {
            if (this[i] === searchElement) {
                return i;
            }
        }

        // Fail if no index
        return -1;
    };
}
/**
 * Function.bind & Array.indexOf Polyfill
 * Copyright (c) 2013 Adam Ranfelt
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */

if (typeof Function.prototype.bind !== 'function') {
    Function.prototype.bind = function bind(thisArg) {

        if (typeof this !== 'function') {
            throw new TypeError('Target is not callable, and unable to be bound');
        }

        var slice = Array.prototype.slice;
        var boundArgs = slice.call(arguments, 1);
        var mainFn = this;

        // Use this in the event that nothin valid is provided
        if (typeof thisArg === 'undefined') {
            thisArg = mainFn;
        }

        // Create the bound the function
        var boundFn = function() {
            var invokeArgs = slice.call(arguments, 0);

            return mainFn.apply(thisArg, boundArgs.concat(invokeArgs));
        };

        // These two clauses will not run due to being unable to change these
        // Calculate length of origin
        // var newLength = mainFn.length - boundArgs.length;
        // if (newLength < 0) {
        //     newLength = 0;
        // }
        // boundFn.length = newLength;

        // Update the name of the function
        // boundFn.name = this.name;

        return boundFn;
    };
}
/**
 * Copyright (c) 2012-2013 Adam Ranfelt
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * EventBus.Event Module Definition
 */

/**
 * Local definition of the global object for faster access
 *
 * @property GLOBAL
 * @for Event
 * @private
 * @type {DOMWindow|Object}
 * @constant
 */
var GLOBAL = this;

/**
 * Event dispatching component used to dispatch events of its own type
 * Helper class to support event dispatching
 * Used to contain event callback relationships
 * Follows the observer pattern subject interface
 * Managed by Namespace structures and the EventBus
 *
 * @class Event
 * @constructor
 *
 * @param {string} name Event Type Name
 */
var Event = function Event(name) {
    
    this.name = name;
    this.observers = [];
};

var proto = Event.prototype;

/**
 * Event type
 *
 * @for Event
 * @property name
 * @type {string}
 */
proto.name = '';

/**
 * Set of callbacks used for observing
 * Collection of functions to call on Event call
 *
 * @for Event
 * @property observers
 * @type {Array}
 */
proto.observers = null;

/**
 * Adds a function to callback with on successful trigger
 * Silently fails if the callback already exists
 *
 * @for Event
 * @method add
 * @param {function} callback Callback method to call to
 */
proto.add = function eventAdd(callback) {
    if (this.observers.indexOf(callback) !== NOT_FOUND_INDEX) {
        return;
    }

    this.observers.push(callback);
};

/**
 * Removes a function that was originally registered to this event
 * Silently fails if the callback doesn't exist
 *
 * @for Event
 * @method remove
 * @param {function} callback Callback method to remove
 */
proto.remove = function eventRemove(callback) {
    var observers = this.observers;
    var index = observers.indexOf(callback);
    if (index === NOT_FOUND_INDEX) {
        return;
    }

    observers.splice(index, 1);
};

/**
 * Check to verify whether the event is holding a callback
 *
 * @for Event
 * @method has
 * @param {function} callback Callback method to check with
 * @returns {boolean}
 */
proto.has = function eventHas(callback) {
    return this.observers.indexOf(callback) !== NOT_FOUND_INDEX;
};

/**
 * Trigger call to fire off any observers
 * Calls the method with the arguments supplied
 * Passes the event type as the first parameter
 * Performs trigger using an atomic set, so if any are removed during trigger
 *
 * @for Event
 * @method trigger
 * @param {Arguments} args Arguments from the managing EventBus
 */
proto.trigger = function eventTrigger(args) {
    var i;
    var observers = this.observers.slice(0);
    var length = observers.length;
    args[0] = this.name;
    for (i = 0; i < length; i++) {
        observers[i].apply(GLOBAL, args);
    }
};
/* global Event: true */
/**
 * Copyright (c) 2012-2013 Adam Ranfelt
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * EventBus.Namespace Module Definition
 */

// implement get event with name to produce a getter that creates the event in the event it does not exist

/**
 * Namespace container to associate namespace-specific events
 * Structure to associate a namespace with specific events
 *
 * @class Namespace
 * @constructor
 *
 * @param {string} name Namespace name
 */
var Namespace = function Namespace(name) {

    this.name = name;
    this.event = new Event(name);
    this.events = {};
};

var proto = Namespace.prototype;

/**
 * Namespace name
 *
 * @for Namespace
 * @property name
 * @type {string}
 */
proto.name = '';

/**
 * Namespace event to allow observation on the namespace level
 *
 * @for Namespace
 * @property event
 * @type {Event}
 */
proto.event = null;

/**
 * Set of event objects to associate with the namespace
 *
 * @for Namespace
 * @property events
 * @type {object}
 */
proto.events = {};

/**
 * Adds a function to callback with on successful trigger
 * Silently fails if the callback already exists
 * Adds to the namespace if the name is undefined
 * Adds to an event if the name is supplied
 *
 * @for Namespace
 * @method add
 * @param {function} callback Callback method to observe with
 * @param {string} name Event name type
 */
proto.add = function namespaceAdd(callback, name) {
    var events = this.events;
    var event = this.event;

    // Sets up the events if a name is supplied
    if (name !== undefined) {
        if (!events.hasOwnProperty(name)) {
            events[name] = new Event(name);
        }

        event = events[name];
    // Uses the local namespace event if no name is supplied
    }

    event.add(callback);
};

/**
 * Removes a function that was originally registered to this event
 * Silently fails if the callback doesn't exist
 * Removes from the namespace if the name is undefined
 * Removes from an event if the name is supplied
 *
 * @for Namespace
 * @method remove
 * @param {function} callback Callback method to remove
 * @param {string} name Event name type
 */
proto.remove = function namespaceRemove(callback, name) {
    var events = this.events;
    var event = this.event;

    // Sets up the events if a name is supplied
    if (name !== undefined) {
        if (!events.hasOwnProperty(name)) {
            events[name] = new Event(name);
        }

        event = events[name];
    // Uses the local namespace event if no name is supplied
    }

    event.remove(callback);
};

/**
 * Trigger call to fire off any observers
 * Triggers the local events after triggering the specific event type
 *
 * @for Namespace
 * @method trigger
 * @param {string} name Event type to trigger
 * @param {Arguments} args Arguments from the managing EventBus
 */
proto.trigger = function namespaceTrigger(name, args) {
    var events = this.events;
    var event;

    if (events.hasOwnProperty(name)) {
        event = events[name];
        event.trigger(args);
    }

    this.event.trigger(args);
};
/* global Namespace: true */
/**
 * Copyright (c) 2012-2013 Adam Ranfelt
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * EventBus Module Definition
 */

// Implement assertion for parameters on on/off
// Implement namespace extraction method in place of if statement
// Implement event extraction method in place of if statement

/**
 * Type definition that all callbacks must be
 * Used to compare all callback types against
 *
 * @for EventBus
 * @property CALLBACK_TYPE
 * @type {string}
 * @final
 * @static
 */
var CALLBACK_TYPE = 'function';

/**
 * Separator used to differentiate events and the namespace
 *
 * @for EventBus
 * @property NAMESPACE_SEPARATOR
 * @type {string}
 * @final
 * @static
 */
var NAMESPACE_SEPARATOR = '.';

/**
 * Finds the namespace object for the supplied namespace
 * Called from the context of the owning EventBus
 * Creates the necessary Namespace if one is not already defined
 *
 * @private
 * @for EventBus
 * @method _getNamespace
 * @param {string} namespace Namespace name to collect
 * @param {Arguments} args Arguments from the managing EventBus
 * @returns Namespace
 */
var _getNamespace = function(namespace) {
    if (namespace === undefined) {
        return this.events;
    }

    var namespaces = this.namespaces;
    if (!namespaces.hasOwnProperty(namespace)) {
        namespaces[namespace] = new Namespace(namespace);
    }

    return namespaces[namespace];
};

/**
 * EventBus Constructor
 *
 * EventBus structure, using the observer pattern
 * Publishes messages based on topics on a topic-to-callback basis
 * Allows namespacing to differentiate source and listen for all namespaced structures
 * Handles observation via function and retains no context about that function
 * Publish-subscribe observer model
 *
 * @class EventBus
 * @constructor
 */
var EventBus = function EventBus() {
    
    this.events = new Namespace('');
    this.namespaces = {};
};

var proto = EventBus.prototype;

/**
 * Basic event calling structure
 * Retains no name or namespace
 * Used to call out each event trigger
 *
 * @for EventBus
 * @property events
 * @type {Namespace}
 */
proto.events = null;

/**
 * Collection of namespaced organized by namespace name key
 *
 * @for EventBus
 * @property namespaces
 * @type {object}
 */
proto.namespaces = null;


/**
 * Sets up a callback for a topic
 * Topic is divided between event and namespace, using a period '.' to separate
 * Callback is given the context of the window to call from
 * Fails silently if it is observing
 *
 * @event {UndefinedError} When the topic or callback is not supplied
 * @event {TypeError} When the callback is not a function
 *
 * @for EventBus
 * @method on
 * @param {string} topic Topic storing an event, a namespace, or a namespaced event
 * @param {function} callback Function to call upon successful trigger
 * @chainable
 */
EventBus.prototype.on = function eventBusOn(topic, callback) {
    if (topic === undefined || callback === undefined) {
        throw new TypeError('UndefinedError: On usage: on(topic, callback)');
    }

    if (typeof callback !== CALLBACK_TYPE) {
        throw new TypeError('TypeError: Callback subscribing is of type ' + (typeof callback) + ' not of type ' + CALLBACK_TYPE);
    }

    var event;
    var namespace;
    var namespaceIndex = topic.lastIndexOf(NAMESPACE_SEPARATOR);

    // If there's only a namespace
    if (topic.charAt(0) === NAMESPACE_SEPARATOR && topic.length !== 1) {
        namespace = topic.substr(1);
    // If there's a namespace and an event
    } else if (namespaceIndex !== NOT_FOUND_INDEX && namespaceIndex !== topic.length - 1) {
        namespace = topic.substr(namespaceIndex + 1);
        event = topic.substr(0, namespaceIndex);
    // If there's only an event
    } else {
        event = topic;
    }

    var targetNamespace = _getNamespace.call(this, namespace);
    targetNamespace.add(callback, event);

    return this;
};

/**
 * Tears down the callback for a topic
 * Topic is divided between event and namespace, using a period '.' to separate
 * Fails silently if it is not already observing
 *
 * @event {UndefinedError} When the topic or callback is not supplied
 * @event {TypeError} When the callback is not a function
 *
 * @for EventBus
 * @method off
 * @param {string} topic Topic storing an event, a namespace, or a namespaced event
 * @param {function} callback Function to remove from observation
 * @chainable
 */
EventBus.prototype.off = function eventBusOff(topic, callback) {
    if (topic === undefined || callback === undefined) {
        throw new TypeError('UndefinedError: Off usage: on(topic, callback)');
    }

    if (typeof callback !== CALLBACK_TYPE) {
        throw new TypeError('TypeError: Callback subscribing is of type ' + (typeof callback) + ' not of type ' + CALLBACK_TYPE);
    }

    var event;
    var namespace;
    var namespaceIndex = topic.lastIndexOf(NAMESPACE_SEPARATOR);

    // If there's only a namespace
    if (topic.charAt(0) === NAMESPACE_SEPARATOR && topic.length !== 1) {
        namespace = topic.substr(1);
    // If there's a namespace and an event
    } else if (namespaceIndex !== NOT_FOUND_INDEX && namespaceIndex !== topic.length - 1) {
        namespace = topic.substr(namespaceIndex + 1);
        event = topic.substr(0, namespaceIndex);
    // If there's only an event
    } else {
        event = topic;
    }

    var targetNamespace = _getNamespace.call(this, namespace);
    targetNamespace.remove(callback, event);

    return this;
};

/**
 * Triggers the event for a specific topic
 * Topic is divided between event and namespace, using a period '.' to separate
 *
 * @event {Error} When the topic is only a namespace
 *
 * @for EventBus
 * @method trigger
 * @param {string} topic Topic storing an event, a namespace, or a namespaced event
 * @chainable
 */
EventBus.prototype.trigger = function eventBusTrigger(topic) {
    var event;
    var namespace;
    var namespaceIndex = topic.lastIndexOf(NAMESPACE_SEPARATOR);
    var namespaces = this.namespaces;

    if (topic.charAt(0) === NAMESPACE_SEPARATOR && topic.length !== 1) {
        throw new TypeError('Error: triggering topic is a namespace and should be an event');
    } else if (namespaceIndex !== NOT_FOUND_INDEX && namespaceIndex !== topic.length - 1) {
        namespace = topic.substr(namespaceIndex + 1);
        event = topic.substr(0, namespaceIndex);
    } else {
        event = topic;
    }

    if (namespace && namespaces.hasOwnProperty(namespace)) {
        namespaces[namespace].trigger(event, arguments);
    }

    this.events.trigger(event, arguments);

    return this;
};
    return EventBus;

}));
