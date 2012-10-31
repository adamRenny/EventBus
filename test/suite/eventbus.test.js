define([
    'src/EventBus'
], function(
    EventBus
) {
    "use strict";
    
    describe('Integration Tests: Events', function() {
        var Events;
        var confirmation = false;
        var callback = function() {
            confirmation = true;
        };
        var eventType = 'test';
        var namespace = '.ns';
        
        beforeEach(function(done) {
            Events = new EventBus();
            confirmation = false;
            done();
        });
        
        it('can be listened to by a callback', function() {
            Events.on(eventType, callback);
            Events.trigger(eventType);
            expect(confirmation).to.be(true);
        });
        
        it('allows callbacks to stop listening to an event', function() {
            Events.on(eventType, callback);
            Events.trigger(eventType);
            expect(confirmation).to.be(true);
            confirmation = false;
            Events.off(eventType, callback);
            Events.trigger(eventType);
            expect(confirmation).to.be(false);
        });
        
        it('can listen to namespaces', function() {
            Events.on(namespace, callback);
            Events.trigger(eventType + namespace);
            expect(confirmation).to.be(true);
        });
        
        it('can\'t hear non-namespaced events when listening to namespaced events', function() {
            Events.on(namespace, callback);
            Events.trigger(eventType + namespace + 'bad');
            expect(confirmation).to.be(false);
        });
        
        it('can stop listening to namespaced events', function() {
            Events.on(namespace, callback);
            Events.trigger(eventType + namespace);
            expect(confirmation).to.be(true);
            confirmation = false;
            Events.off(namespace, callback);
            Events.trigger(eventType + namespace);
            expect(confirmation).to.be(false);
        });
        
        it('can listen to non-namespaced events and hear them when they are namespaced', function() {
            Events.on(eventType, callback);
            Events.trigger(eventType + namespace);
            expect(confirmation).to.be(true);
        });
        
        it('can listen to specific namespaced events', function() {
            Events.on(eventType + namespace, callback);
            Events.trigger(eventType + namespace);
            expect(confirmation).to.be(true);
        });
        
        it('can listen to specific namespaced events, but not hear non-namespaced', function() {
            Events.on(eventType + namespace, callback);
            Events.trigger(eventType);
            expect(confirmation).to.be(false);
        });
        
        it('can\'t trigger a namespace', function() {
            Events.on(namespace, callback);
            var success = true;
            try {
                Events.trigger(namespace);
            } catch (e) {
                success = false;
            }
            expect(confirmation).to.be(false);
        });
    });
});