/* global Event: true */
/**
 * Namespace container to associate namespace-specific events
 *
 * @private
 * @name Namespace
 * @class Namespace structure to associate a namespace with specific events
 * @constructor
 *
 * @param {string} name Namespace name
 * @since 2.0
 */
var Namespace = function(name) {
    /**
     * Namespace name
     *
     * @name Namespace#name
     * @type {string}
     * @since 2.0
     */
    this.name = name;

    /**
     * Namespace event to allow observation on the namespace level
     *
     * @name Namespace#event
     * @type {Event}
     * @since 2.0
     */
    this.event = new Event(name);

    /**
     * Set of event objects to associate with the namespace
     *
     * @name Namespace#events
     * @type {object}
     * @since 2.0
     */
    this.events = {};
};

/**
 * Adds a function to callback with on successful trigger
 * Silently fails if the callback already exists
 * Adds to the namespace if the name is undefined
 * Adds to an event if the name is supplied
 *
 * @param {function} callback Callback method to observe with
 * @param {string} name Event name type
 * @since 2.0
 */
Namespace.prototype.add = function(callback, name) {
    var events = this.events;
    var event;

    // Sets up the events if a name is supplied
    if (name !== undefined) {
        if (!events.hasOwnProperty(name)) {
            events[name] = new Event(name);
        }

        event = events[name];
    // Uses the local namespace event if no name is supplied
    } else {
        event = this.event;
    }

    event.add(callback);
};

/**
 * Removes a function that was originally registered to this event
 * Silently fails if the callback doesn't exist
 * Removes from the namespace if the name is undefined
 * Removes from an event if the name is supplied
 *
 * @param {function} callback Callback method to remove
 * @param {string} name Event name type
 * @since 2.0
 */
Namespace.prototype.remove = function(callback, name) {
    var events = this.events;
    var event;

    // Sets up the events if a name is supplied
    if (name !== undefined) {
        if (!events.hasOwnProperty(name)) {
            events[name] = new Event(name);
        }

        event = events[name];
    // Uses the local namespace event if no name is supplied
    } else {
        event = this.event;
    }

    event.remove(callback);
};

/**
 * Trigger call to fire off any observers
 * Triggers the local events after triggering the specific event type
 *
 * @param {string} name Event type to trigger
 * @param {Arguments} args Arguments from the managing EventBus
 * @since 2.0
 */
Namespace.prototype.trigger = function(name, args) {
    var events = this.events;
    var event;

    if (events.hasOwnProperty(name)) {
        event = events[name];
        event.trigger(args);
    }

    this.event.trigger(args);
};