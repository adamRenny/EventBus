# EventBus
Context-less, namespace-able event system via publish-subscribe observer pattern.

## Usage
EventBus is built to be usable from ```bower```.

Usage:
```
bower install EventBus
```

## Licensing
EventBus is licensed under the [MIT license](http://opensource.org/licenses/mit-license.html).

## Interface
Uses common ```on```, ```off```, and ```trigger``` interface calls.

## Namespace
Uses namespacing separated by a period ```.```. Namespaces are used to reference specific call groups. Namespaces cannot be triggered directly. Events can be called with or without a namespace.

The event bus allows for listening to either an event directly, namespace directly, or a namespaced event.

# Testing
Includes minor integration testing code.