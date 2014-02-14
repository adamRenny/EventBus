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