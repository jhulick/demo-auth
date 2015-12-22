
/**
 * @ngdoc service
 * @name AuthServerProvider
 * @description
 *     Authentication Session service
 */

(function() {

    'use strict';

    angular.module('blocks.auth')
        .factory('AuthServerProvider', LoginService);

    /**
     * @ngdoc method
     * @name AuthServerProvider#LoginService
     * @description
     *     Configure the Authentication Session service
     * @return {Object} configuration settings for AuthServerProvider
     */
    /* @ngInject */
    function LoginService($http, localStorageService, $window) {

        var service = {
            login: login,
            logout: logout,
            getToken: getToken,
            hasValidToken: hasValidToken
        };

        return service;

        ///////////////////////////////////////////////////////////////////

        function login(credentials) {
            var data = 'j_username=' + encodeURIComponent(credentials.username) +
                '&j_password=' + encodeURIComponent(credentials.password) +
                '&_spring_security_remember_me=' + credentials.rememberMe + '&submit=Login';
            return $http.post('api/authentication', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (response) {
                localStorageService.set('token', $window.btoa(credentials.username + ':' + credentials.password));
                return response;
            });
        };

        function logout() {
            // logout from the server
            $http.post('api/logout')
                .success(function (response) {
                    localStorageService.clearAll();
                    // to get a new csrf token call the api
                    $http.get('api/account');
                    return response;
                }
            );
        };

        function getToken() {
            var token = localStorageService.get('token');
            return token;
        };

        function hasValidToken() {
            var token = this.getToken();
            return !!token;
        }
    };

})();
