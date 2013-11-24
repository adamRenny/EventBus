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
