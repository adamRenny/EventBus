# Events
Context-less, namespace-able event system via publish-subscribe observer pattern.

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