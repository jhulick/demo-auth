
/**
 * @ngdoc service
 * @name UserService
 * @description
 *     Application user data API.
 */
(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('userservice', UserService);

    /**
     * @ngdoc method
     * @name app.core#UserService
     * @description
     *     Configures the UserService.
     * @param  {[type]} $http
     * @param  {[type]} $q
     * @param  {[type]} exception
     * @param  {[type]} logger
     * @return {Object} UserService service
     */
    /* @ngInject */
    function UserService($http, $location, $q, exception, logger) {
        var user;

        var service = {
            login: login,
            logout: logout,
            renewSession: renewSession,
            getUser: getUser
        };

        return service;

        //================================================================

        function renewSession(data) {
            return this.login(data);
        }

        function login() {
            return $http.post('/auth/' + data.strategy, data.session)
                .then(loginComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for login')(message);
                    $location.url('/');
                });

            function loginComplete(data, status, headers, config) {
                return data.data.results;
            }
        }

        function logout() {
            return $http.get('/users/logout')
                .then(logoutComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for logout')(message);
                    $location.url('/');
                });

            function logoutComplete(data, status, headers, config) {
                return data.data.results;
            }
        }

        function getUser() {
            return $http.get('/users/session')
                .then(getUserComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getUser')(message);
                    $location.url('/');
                });

            function getUserComplete(data, status, headers, config) {
                return data.data.results;
            }
        }
    }
})();
