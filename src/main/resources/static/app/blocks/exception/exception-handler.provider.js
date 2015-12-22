// Include in index.html so that app level exceptions are handled.
// Exclude from testRunner.html which should run exactly what it wants to run
/**
 * @ngdoc service
 * @name exceptionHandler
 * @description
 *     Exception handling for the application.
 */
(function() {
    'use strict';

    angular
        .module('blocks.exception')
        .provider('exceptionHandler', exceptionHandlerProvider)
        .config(config);

    /**
     * @ngdoc method
     * @name exceptionHandler#exceptionHandlerProvider
     * @description
     *     Configure the exception handling and set its events via the exceptionHandlerProvider
     * @return {Object} configuration settings for exceptionHandler
     */
    function exceptionHandlerProvider() {
        /* jshint validthis:true */
        this.config = {
            appErrorPrefix: undefined
        };

        this.configure = function (appErrorPrefix) {
            this.config.appErrorPrefix = appErrorPrefix;
        };

        this.$get = function() {
            return {config: this.config};
        };
    }

    /**
     * @ngdoc method
     * @name blocks.exception.exceptionHandler#config
     * @description
     *     Configure by setting an optional string value for appErrorPrefix.
     *     Accessible via config.appErrorPrefix (via config value).
     * @param  {[type]} $provide
     * @return {[type]}
     * @ngInject
     */
    function config($provide) {
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    /**
     * @ngdoc method
     * @name exceptionHandler#extendExceptionHandler
     * @description Extend the $exceptionHandler service to also display a toast.
     * @param  {Object} $delegate
     * @param  {Object} exceptionHandler
     * @param  {Object} logger
     * @return {Function} the decorated $exceptionHandler service
     */
    function extendExceptionHandler($delegate, exceptionHandler, logger) {
        var appErrorPrefix = exceptionHandler.config.appErrorPrefix || '';
        return function(exception, cause) {
            $delegate(exception, cause);
            var errorData = {exception: exception, cause: cause};
            var msg = appErrorPrefix + exception.message;

            /**
             * Could add the error to a service's collection,
             * add errors to $rootScope, log errors to remote web server,
             * or log locally. Or throw hard. It is entirely up to you.
             * throw exception;
             *
             * @example
             *     throw { message: 'error message we added' };
             */
            logger.error(msg, errorData);
        };
    }
})();
