/**
 * @ngdoc module
 * @name blocks.router
 * @description Defines the AngularJs route handling module.
 */
(function() {
    'use strict';

    angular.module('blocks.router', [
        'ui.router',
        'blocks.logger'
        //'oc.lazyLoad',
        //'appRequires'
    ]);
})();