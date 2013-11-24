/* global Namespace: true */
/**
 * @fileOverview
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
 * Needs Object.prototype.hasOwnProperty, Array.prototype.indexOf, and Function.prototype.bind
 * @author Adam Ranfelt
 * @version 2.0.1
 */

/**
 * Type definition that all callbacks must be
 * Used to compare all callback types against
 *
 * @type {string}
 * @constant
 * @since 1.0
 */
var CALLBACK_TYPE = 'function';

/**
 * Separator used to differentiate events and the namespace
 *
 * @type {string}
 * @constant
 * @since 2.0
 */
var NAMESPACE_SEPARATOR = '.';

/**
 * Finds the namespace object for the supplied namespace
 * Called from the context of the owning EventBus
 * Creates the necessary Namespace if one is not already defined
 *
 * @private
 * @param {string} namespace Namespace name to collect
 * @param {Arguments} args Arguments from the managing EventBus
 * @since 2.0
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
 *
 * @name EventBus
 * @class Publish-subscribe observer model
 * @constructor
 * @since 1.0
 */
var EventBus = function() {
    /**
     * Basic event calling structure
     * Retains no name or namespace
     * Used to call out each event trigger
     *
     * @name EventBus#events
     * @type {Namespace}
     * @since 2.0
     */
    this.events = new Namespace('');

    /**
     * Collection of namespaced organized by namespace name key
     *
     * @name EventBus#namespaces
     * @type {object}
     * @since 2.0
     */
    this.namespaces = {};

    /**
     * Convenience function to gather the namespace
     * Gets a new namespace if it doesn't exist
     *
     * @function
     * @name EventBus#getNamespace
     * @type {function}
     * @since 2.0
     */
    this.getNamespace = _getNamespace.bind(this);
};

/**
 * Sets up a callback for a topic
 * Topic is divided between event and namespace, using a period '.' to separate
 * Callback is given the context of the window to call from
 * Fails silently if it is observing
 *
 * @throws {UndefinedError} When the topic or callback is not supplied
 * @throws {TypeError} When the callback is not a function
 *
 * @param {string} topic Topic storing an event, a namespace, or a namespaced event
 * @param {function} callback Function to call upon successful trigger
 * @returns {EventBus}
 * @since 2.0
 */
EventBus.prototype.on = function(topic, callback) {
    if (topic === undefined || callback === undefined) {
        throw 'UndefinedError: On usage: on(topic, callback)';
    }

    if (typeof callback !== CALLBACK_TYPE) {
        throw 'TypeError: Callback subscribing is of type ' + (typeof callback) + ' not of type ' + CALLBACK_TYPE;
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

    var targetNamespace = this.getNamespace(namespace);
    targetNamespace.add(callback, event);

    return this;
};

/**
 * Tears down the callback for a topic
 * Topic is divided between event and namespace, using a period '.' to separate
 * Fails silently if it is not already observing
 *
 * @throws {UndefinedError} When the topic or callback is not supplied
 * @throws {TypeError} When the callback is not a function
 *
 * @param {string} topic Topic storing an event, a namespace, or a namespaced event
 * @param {function} callback Function to remove from observation
 * @returns {EventBus}
 * @since 2.0
 */
EventBus.prototype.off = function(topic, callback) {
    if (topic === undefined || callback === undefined) {
        throw 'UndefinedError: Off usage: on(topic, callback)';
    }

    if (typeof callback !== CALLBACK_TYPE) {
        throw 'TypeError: Callback subscribing is of type ' + (typeof callback) + ' not of type ' + CALLBACK_TYPE;
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

    var targetNamespace = this.getNamespace(namespace);
    targetNamespace.remove(callback, event);

    return this;
};

/**
 * Triggers the event for a specific topic
 * Topic is divided between event and namespace, using a period '.' to separate
 *
 * @throws {Error} When the topic is only a namespace
 *
 * @param {string} topic Topic storing an event, a namespace, or a namespaced event
 * @returns {EventBus}
 * @since 2.0
 */
EventBus.prototype.trigger = function(topic) {
    var event;
    var namespace;
    var namespaceIndex = topic.lastIndexOf(NAMESPACE_SEPARATOR);
    var namespaces = this.namespaces;

    if (topic.charAt(0) === NAMESPACE_SEPARATOR && topic.length !== 1) {
        throw 'Error: triggering topic is a namespace and should be an event';
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