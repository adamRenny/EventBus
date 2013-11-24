/**
 * Local definition of the window for faster access
 *
 * @private
 * @type {DOMWindow}
 * @constant
 * @since 2.0
 */
var GLOBAL = this;

/**
 * Event dispatching component used to dispatch events of its own type
 * Helper class to support event dispatching
 * Used to contain event callback relationships
 * Follows the observer pattern subject interface
 * Managed by Namespace structures and the EventBus
 *
 * @private
 * @name Event
 * @class Event observer dispatch structure
 * @constructor
 *
 * @param {string} name Event Type Name
 * @since 2.0
 */
var Event = function(name) {
    /**
     * Event type
     *
     * @name Event#name
     * @type {string}
     * @since 2.0
     */
    this.name = name;

    /**
     * Set of callbacks used for observing
     * Collection of functions to call on Event call
     *
     * @name Event#observers
     * @type {Array}
     * @since 2.0
     */
    this.observers = [];
};

/**
 * Adds a function to callback with on successful trigger
 * Silently fails if the callback already exists
 *
 * @param {function} callback Callback method to call to
 * @since 2.0
 */
Event.prototype.add = function(callback) {
    var observers = this.observers;
    if (observers.indexOf(callback) !== NOT_FOUND_INDEX) {
        return;
    }

    observers.push(callback);
};

/**
 * Removes a function that was originally registered to this event
 * Silently fails if the callback doesn't exist
 *
 * @param {function} callback Callback method to remove
 * @since 2.0
 */
Event.prototype.remove = function(callback) {
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
 * @param {function} callback Callback method to check with
 * @returns {boolean}
 * @since 2.0
 */
Event.prototype.has = function(callback) {
    return this.observers.indexOf(callback) !== NOT_FOUND_INDEX;
};

/**
 * Trigger call to fire off any observers
 * Calls the method with the arguments supplied
 * Passes the event type as the first parameter
 * Performs trigger using an atomic set, so if any are removed during trigger
 *
 * @param {Arguments} args Arguments from the managing EventBus
 * @since 2.0
 */
Event.prototype.trigger = function(args) {
    var i = 0;
    var observers = this.observers.slice(0);
    var length = observers.length;
    args[0] = this.name;
    for (; i < length; i++) {
        observers[i].apply(GLOBAL, args);
    }
};