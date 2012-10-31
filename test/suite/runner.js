require.config({
    baseUrl: '..',
    paths: {
        src: 'src',
        assets: 'test/assets/js',
        suite: 'test/suite'
    }
});

require([
    'assets/mocha',
    'assets/expect'
], function(
) {
    "use strict";
    mocha.setup('bdd');
    
    require([
        'suite/eventbus.test'
    ], function() {
        mocha.run();
    });
});