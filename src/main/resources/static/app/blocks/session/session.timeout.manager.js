
/**
 * @ngdoc service
 * @name sessionTimeoutManager
 * @description
 *     Timeout handling for the application.
 */
(function() {
    'use strict';

    angular.module('blocks.session')
        .factory('sessionTimeoutManager', ['$idle', '$rootScope', sessionTimeoutManager]);

    function sessionTimeoutManager($idle, $rootScope) {
        var timeout = {
            lastActivity: new Date(),
            reset: resetIdle()
        };

        /**
         * @ngdoc method
         * @name sessionTimeoutManager#resetIdle
         * @description Resets the ng-idle's watch and broadcasts a reset event
         */
        function resetIdle() {
            $idle.unwatch();
            $idle.watch();
            $rootScope.$broadcast('$sessionResetIdle');
        }


        return timeout;
    }

})();