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

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals
        root.amdWeb = factory();
    }
}(this, function () {

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
}));
