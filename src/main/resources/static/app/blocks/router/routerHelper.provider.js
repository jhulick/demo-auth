
/**
 * @ngdoc service
 * @name logger
 * @description
 *     Helper for configuring the UI-Router states and their associated URL routes and views.
 *     Adds "state-changed" reporting for security hooks and development debugging.
 */

(function() {
    'use strict';

    angular
        .module('blocks.router')
        .provider('routerHelper', routerHelperProvider);

    /**
     * @ngdoc method
     * @name routerHelper#routerHelperProvider
     * @description
     *     Configure the route handling and set its events via the routerHelperProvider
     * @param  {[type]} $stateProvider
     * @param  {[type]} $urlRouterProvider
     * @return {Object} configuration settings for routerHelper
     */
    function routerHelperProvider($stateProvider, $urlRouterProvider) {
        /* jshint validthis:true */
        var config = {
            docTitle: undefined,
            resolveAlways: {}
        };

        this.configure = function(cfg) {
            angular.extend(config, cfg);
        };

        /* @ngInject */
        this.$get = function RouterHelper($location, $rootScope, $state, logger) {
            var handlingStateChangeError = false;
            var hasOtherwise = false;
            var stateCounts = {
                errors: 0,
                changes: 0
            };

            var service = {
                configureStates: configureStates,
                getStates: getStates,
                stateCounts: stateCounts
            };

            init();

            return service;

            /////////////////////////////////////////////////////////////////////////////////

            function configureStates(states, otherwisePath) {
                states.forEach(function(state) {
                    state.config.resolve =
                        angular.extend(state.config.resolve || {}, config.resolveAlways);
                    $stateProvider.state(state.state, state.config);
                });
                if (otherwisePath && !hasOtherwise) {
                    hasOtherwise = true;
                    $urlRouterProvider.otherwise(otherwisePath);
                }
            }

            function handleRoutingErrors() {
                // Route cancellation:
                // On routing error, go to the dashboard.
                // Provide an exit clause if it tries to do it twice.
                $rootScope.$on('$stateChangeError',
                    function(event, toState, toParams, fromState, fromParams, error) {
                        if (handlingStateChangeError) {
                            return;
                        }
                        stateCounts.errors++;
                        handlingStateChangeError = true;
                        var destination = (toState && (toState.title || toState.name || toState.loadedTemplateUrl)) ||
                            'unknown target';
                        var msg = 'Error routing to ' + destination + '. ' +
                            (error.data || '') + '. <br/>' + (error.statusText || '') +
                            ': ' + (error.status || '');
                        logger.warning(msg, [toState]);
                        $location.path('/');
                    }
                );
            }

            function init() {
                handleRoutingErrors();
                updateDocTitle();
            }

            function getStates() { return $state.get(); }

            function updateDocTitle() {
                $rootScope.$on('$stateChangeSuccess',
                    function(event, toState, toParams, fromState, fromParams) {
                        stateCounts.changes++;
                        handlingStateChangeError = false;
                        var title = config.docTitle + ' ' + (toState.title || '');
                        $rootScope.title = title; // data bind to <title>
                    }
                );
            }

            // Generates a resolve object by passing script names
            // previously configured in constant.APP_REQUIRES
            //function resolveFor() {
            //    var _args = arguments;
            //    return {
            //        deps: ['$ocLazyLoad','$q', function ($ocLL, $q) {
            //            // Creates a promise chain for each argument
            //            var promise = $q.when(1); // empty promise
            //            for (var i = 0, len = _args.length; i < len; i ++) {
            //                promise = andThen(_args[i]);
            //            }
            //            return promise;
            //
            //            // creates promise to chain dynamically
            //            function andThen(_arg) {
            //                // also support a function that returns a promise
            //                if (typeof _arg == 'function')
            //                    return promise.then(_arg);
            //                else
            //                    return promise.then(function() {
            //                        // if is a module, pass the name. If not, pass the array
            //                        var whatToLoad = getRequired(_arg);
            //                        // simple error check
            //                        if(!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
            //                        // finally, return a promise
            //                        return $ocLL.load( whatToLoad );
            //                    });
            //            }
            //            // check and returns required data
            //            // analyze module items with the form [name: '', files: []]
            //            // and also simple array of script files (for non angular js)
            //            function getRequired(name) {
            //                if (appRequires.modules)
            //                    for (var m in appRequires.modules)
            //                        if (appRequires.modules[m].name && appRequires.modules[m].name === name)
            //                            return appRequires.modules[m];
            //                return appRequires.scripts && appRequires.scripts[name];
            //            }
            //
            //        }]};
            //}; // resolveFor
        };
    }
})();
