
/**
 * @ngdoc module
 * @name app
 * @description Defines the AngularJs application module and initializes submodules
 */
(function() {
    'use strict';

    var app = angular.module('app', [

        /*
         * Everybody has access to these
         */
        'app.core',
        'app.widgets',


        /*
         * Feature areas
         */
        'app.session',
        'app.grid',
        //'app.customers',
        'app.dashboard',
        'app.docs',
        'app.layout'
    ]);

    app.run(['appStart', function(appStart) {
        appStart.start();
    }]);

})();