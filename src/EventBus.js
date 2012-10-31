/**
 * @fileOverview
 * Copyright (c) 2012 Adam Ranfelt
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
 * @author Adam Ranfelt <adamRenny@gmail.com>
 * @version 2.0
 */
define(function() {
    "use strict";
    
    /**
     * Type definition that all callbacks must be
     * Used to compare all callback types against
     *
     * @type {string}
     * @constant
     * @since 1.0
     */
    var CALLBACK_TYPE = 'function';
    
    var NAMESPACE_SEPARATOR = '.';
    
    var NOT_FOUND_INDEX = -1;
    
    var Event = function(name) {
        this.name = name;
        this.observers = [];
    };
    
    Event.prototype.add = function(callback) {
        var observers = this.observers;
        if (observers.indexOf(callback) !== NOT_FOUND_INDEX) {
            return;
        }
        
        observers.push(callback);
    };
    
    Event.prototype.remove = function(callback) {
        var observers = this.observers;
        var index = observers.indexOf(callback);
        if (index === NOT_FOUND_INDEX) {
            return;
        }
        
        observers.splice(index, 1);
    };
    
    Event.prototype.has = function(callback) {
        return this.observers.indexOf(callback) !== NOT_FOUND_INDEX;
    };
    
    Event.prototype.trigger = function(args) {
        var i = 0;
        var observers = this.observers;
        var length = observers.length;
        args[0] = this.name;
        for (; i < length; i++) {
            observers[i].apply(this, args);
        }
    };
    
    var Namespace = function(name) {
        this.name = name;
        this.event = new Event(name);
        this.events = {};
    };
    
    Namespace.prototype.add = function(callback, name) {
        var events = this.events;
        var event;
        
        if (name !== undefined) {
            if (!events.hasOwnProperty(name)) {
                events[name] = new Event(name);
            }
            
            event = events[name];
        } else {
            event = this.event;
        }
        
        event.add(callback);
    };
    
    Namespace.prototype.remove = function(callback, name) {
        var events = this.events;
        var event;
        
        if (name !== undefined) {
            if (!events.hasOwnProperty(name)) {
                events[name] = new Event(name);
            }
            
            event = events[name];
        } else {
            event = this.event;
        }
        
        event.remove(callback);
    };
    
    // trigger all namespaced and non-namespaced
    Namespace.prototype.trigger = function(name, args) {
        var events = this.events;
        var event;
        
        if (events.hasOwnProperty(name)) {
            event = events[name]
            event.trigger(args);
        }
        
        this.event.trigger(args);
    };
    
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
     *
     * @name EventBus
     * @class Publish-subscribe observer model
     * @constructor
     * @since 1.0
     */
    var EventBus = function() {
        this.events = new Namespace('');
        this.namespaces = {};
    };
    
    // namespace + event
    // event
    // namespace
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
        
        if (topic.charAt(0) === NAMESPACE_SEPARATOR && topic.length !== 1) {
            namespace = topic.substr(1);
        } else if (namespaceIndex !== NOT_FOUND_INDEX && namespaceIndex !== topic.length - 1) {
            namespace = topic.substr(namespaceIndex + 1);
            event = topic.substr(0, namespaceIndex);
        } else {
            event = topic;
        }
        
        var targetNamespace = _getNamespace.call(this, namespace);
        targetNamespace.add(callback, event);
    };
    
    // namespace + event
    // event
    // namespace
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
        
        if (topic.charAt(0) === NAMESPACE_SEPARATOR && topic.length !== 1) {
            namespace = topic.substr(1);
        } else if (namespaceIndex !== NOT_FOUND_INDEX && namespaceIndex !== topic.length - 1) {
            namespace = topic.substr(namespaceIndex + 1);
            event = topic.substr(0, namespaceIndex);
        } else {
            event = topic;
        }
        
        var targetNamespace = _getNamespace.call(this, namespace);
        targetNamespace.remove(callback, event);
    };
    
    // event
    // event + namespace
    EventBus.prototype.trigger = function(topic) {
        var event;
        var namespace;
        var namespaceIndex = topic.lastIndexOf(NAMESPACE_SEPARATOR);
        var namespaces = this.namespaces;
        
        if (namespaceIndex !== NOT_FOUND_INDEX && namespaceIndex !== topic.length - 1) {
            namespace = topic.substr(namespaceIndex + 1);
            event = topic.substr(0, namespaceIndex);
        } else {
            event = topic;
        }
        
        if (namespace && namespaces.hasOwnProperty(namespace)) {
            namespaces[namespace].trigger(event, arguments);
        }
        this.events.trigger(event, arguments);
    };
    
    return EventBus;
});