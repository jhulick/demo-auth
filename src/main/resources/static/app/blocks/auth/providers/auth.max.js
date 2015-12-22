
/**
 * @ngdoc service
 * @name CASMax
 * @description
 *     MAX CAS Authentication service
 */

(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name blocks.auth.max:CASMax
     * @description
     * Service consumption docs.
     */

    angular
        .module('blocks.auth')
        .provider('CASMax', CASMaxProvider);

    /**
     * @ngdoc method
     * @name CASMax#CASMaxProvider
     * @description
     *     Configure the MAX CAS authentication provider
     * @return {Object} configuration settings for CASMaxProvider
     */
    function CASMaxProvider() {

        /**
         * @name CASMax#options
         * @type {Object}
         * @propertyOf CASMax#CASMaxProvider
         */
        var opts = {
            max_id: '',
            scope: 'email',
            redirect_uri: encodeURIComponent(window.location.origin + '/auth/max/callback'),
            response_type: 'token',
            state: '' + Math.random() * 0.1e19 + Math.random() * 0.5e19 + Math.random() * 0.9e19
        };

        var baseUrl = 'http://localhost:7203/dialog/max';

        var session;

        /**
         * @ngdoc function
         * @methodOf CASMax#CASMaxProvider
         * @name CASMax#configure
         * @param  {String} cfg the config options
         * @description
         * Public provider configuration function.
         * Use within a angular.config block.
         */
        this.configure = function(cfg) {
            if (typeof cfg !== 'object') {
                throw new Error('CASMaxProvider: configure expects an object');
            }
            opts = angular.extend(opts, cfg);
        }

        /**
         * Inject services used within your service here
         */
        /* @ngInject */
        this.$get = function casMax($rootScope, $window, $q, $http, $timeout) {

            var buildUrl = function () {
                return baseUrl + '?max_id=' + opts.max_id
                    + '&app_id=' + opts.max_id
                    + '&response_type=' + opts.response_type
                    + '&state=' + opts.state
                    + '&scope=' + opts.scope
                    + '&redirect_uri=' + opts.redirect_uri;
            }

            $rootScope.$on('auth:max::callback', function (event, data) {

                if (data.strategy !== 'max') return;
                session = data.state === opts.state ? data : undefined;

                $timeout(function () {
                    if (!!session) {
                        $rootScope.$broadcast('auth:max::success', {
                            strategy: 'max',
                            session: session
                        });
                    } else {
                        $rootScope.$broadcast('auth:max::failure', {
                            strategy: 'max',
                            error: !!session?null: 'Original and Returned State\'s don\'t match.'
                        });
                    }
                }, 0);
            });

            $rootScope.$on('auth:max::failure', function (event, data) {
                if (data.strategy === 'max') {
                    session = false;
                }
            })

            $rootScope.$on('auth:max::success', function (event, data) {
                $timeout(function () {
                    $rootScope.$broadcast('auth:max::expired', data);
                }, data.session.expires_in * 1000);
            });

            $rootScope.$on('auth:logout::success', function (event, data) {
                session = false;
            });

            var service = {
                APICall: APICall,
                getAccessToken: getAccessToken,
                getConfig: getConfig
            };

            return service;


            /**
             * @name APICall
             * @ngdoc function
             * @param  {String} query the query string
             * @return {Promise}
             */
            function APICall(query) {
                var token = this.getAccessToken();
                query = query.split('');

                if (query[0] !== '/') {
                    query.unshift('/');
                }

                if (query[query.length-1] !== '/') {
                    query.push('/');
                }

                query = query.join('');
                var deferred = $q.defer();
                $http.get('http://localhost:7203/auth' + query + '?access_token=' + token)
                    .success(function (data, status, header, config) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, header, config) {
                        deferred.reject(data);
                    });
                return deferred.promise;
            }

            /**
             * @name getAccessToken
             * @ngdoc function
             * @methodOf CASMax#CASMaxProvider
             * @return {Object} Something
             */
            function getAccessToken() {
                if (session) {
                    return session.access_token
                } else {
                    $window.open(buildUrl(), '', 'width=300');
                }
            }

            /**
             * @name getConfig
             * @return {Object} the configuration object
             */
            function getConfig() {
                return opts;
            }
        }
    };

})();