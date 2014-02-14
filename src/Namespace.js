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