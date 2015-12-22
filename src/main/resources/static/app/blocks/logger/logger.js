
/**
 * @ngdoc service
 * @name logger
 * @description
 *     Log handling for the application.
 */
(function() {
    'use strict';

    angular
        .module('blocks.logger')
        .factory('logger', logger);

    logger.$inject = ['$log', 'toastr', 'moment'];

    /**
     * @ngdoc method
     * @name logger#logger
     * @description
     *     Log events with toastr
     * @param  {[type]} $log
     * @param  {[type]} toastr
     * @param  {[type]} log4js
     * @param  {[type]} moment
     * @return {Object} logger service
     */
    function logger($log, toastr, moment) {
        var service = {
            showToasts: true,
            showLog4js: false,

            error   : error,
            info    : info,
            success : success,
            warning : warning,

            // straight to console; bypass toastr
            log     : log
        };

        return service;


        /**
         * @ngdoc method
         * @name logger#error
         * @description
         *     Log error events
         * @param  {[type]} message
         * @param  {[type]} data
         * @param  {[type]} title
         * @param  {[type]} context
         */
        function error(message, data, title, context) {
            if (service.showToasts)
                toastr.error(message, title);

//            $log.getInstance(context)
//                .enableLogging(service.showLog4js)
//                .log('Error: ' + message, data);
        }

        /**
         * @ngdoc method
         * @name logger#info
         * @description
         *     Log info events
         * @param  {[type]} message
         * @param  {[type]} data
         * @param  {[type]} title
         * @param  {[type]} context
         */
        function info(message, data, title, context) {
            if (service.showToasts)
                toastr.info(message, title);

//            $log.getInstance(context)
//                .enableLogging(service.showLog4js)
//                .log('Info: ' + message, data);

        }

        /**
         * @ngdoc method
         * @name logger#success
         * @description
         *     Log success events
         * @param  {[type]} message
         * @param  {[type]} data
         * @param  {[type]} title
         * @param  {[type]} context
         */
        function success(message, data, title, context) {
            if (service.showToasts)
                toastr.success(message, title);

//            $log.getInstance(context)
//                .enableLogging(service.showLog4js)
//                .log('Success: ' + message, data);
        }

        /**
         * @ngdoc method
         * @name logger#warning
         * @description
         *     Log warn events
         * @param  {[type]} message
         * @param  {[type]} data
         * @param  {[type]} title
         * @param  {[type]} context
         */
        function warning(message, data, title, context) {
            if (service.showToasts)
                toastr.warning(message, title);

//            $log.getInstance(context)
//                .enableLogging(service.showLog4js)
//                .log('Warning: ' + message, data);
        }

        /**
         * @ngdoc method
         * @name logger#log
         * @description
         *     Log log events
         * @param  {[type]} message
         * @param  {[type]} data
         * @param  {[type]} title
         * @param  {[type]} context
         */
        function log(message, data, title, context) {
            if (service.showToasts)
                toastr.warning(message, title);

//            $log.getInstance(context)
//                .enableLogging(service.showLog4js)
//                .log('Log: ' + message, data);
        }
    }
}());
