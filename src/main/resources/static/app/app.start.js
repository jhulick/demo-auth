
/**
 * @ngdoc factory
 * @name appStart
 * @description The application startup function, called in the app module's run block. Create apart from app.js so it can easily be stubbed out during testing or tested independently
 */

(function() {
    'use strict';

    angular.module('app').factory('appStart', startup);

    startup.$inject = [
        //'$idle',
        'logger'
    ];

    function startup(/*$idle,*/ logger) {
        var appStart = {
            start: start
        };
        return appStart;

        function start() {
            logger.info('MAX PaaS SPA is loaded and running');

            // Trigger initial session watch utility
            //$idle.watch();
        };
    };

})();