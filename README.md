# Events
Context-less, namespace-able event system via publish-subscribe observer pattern.

## Licensing
EventBus is licensed under the [MIT license](http://opensource.org/licenses/mit-license.html).

EventBus includes functional polyfills for ```Array#indexOf``` and ```Function#bind``` within ```dependency.js```. These are licensed under the [MPL license](http://www.mozilla.org/MPL/2.0/).

The ```dependency.js``` is intended to be included separate from the EventBus to avoid infringing on any sort of licensing breaches that would occur with compilation of the EventBus and the project it is used in.

## Interface
Uses common ```on```, ```off```, and ```trigger``` interface calls.

## Namespace
Uses namespacing separated by a period ```.```. Namespaces are used to reference specific call groups. Namespaces cannot be triggered directly. Events can be called with or without a namespace.

The event bus allows for listening to either an event directly, namespace directly, or a namespaced event.

## Dependencies
Requires the use of the following native methods:

 - ```Array#indexOf```
 - ```Object#hasOwnProperty```
 - ```Function#bind```

# Testing
Includes minor integration testing code.