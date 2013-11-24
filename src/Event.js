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