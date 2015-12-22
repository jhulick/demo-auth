
/**
 * @ngdoc module
 * @name app.core
 * @description
 *    Defines the core AngularJs application module and initializes sub-modules
 */
(function() {
    'use strict';

    angular.module('app.core', [
        'ngAnimate',
        'ngSanitize',
        //'oc.lazyLoad',
        //'appRequires',
        //'ngIdle',
        'LocalStorageModule',
        'blocks.exception',
        'blocks.logger',
        'blocks.router',
        'blocks.auth',
        'ui.router',
        'ngplus',
        'breeze.angular',
        'dt'
    ]);
})();
