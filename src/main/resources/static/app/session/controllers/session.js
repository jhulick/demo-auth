(function () {
    'use strict';

    angular.module('app')
        .controller('Session', ['$q', '$http', '$rootScope', 'localStorageService', 'logger', login]);

    function login($q, $http, $rootScope, localStorageService, logger) {
        var vm = this;

        vm.activate = activate;
        $rootScope.isAuthenticated = false;
        vm.callRestricted = callRestricted; // for demo
        vm.callAdmin = callAdmin; // for demo
        vm.logout = logout;
        vm.message = '';
        vm.submit = submit;
        vm.welcome = '';

        activate();

        function activate() {
            if (localStorageService.get('token')) {
                $rootScope.isAuthenticated = true;
            }
            var promises = [submit()];
            return $q.all(promises).then(function() {
                logger.info('Activated Session');
            });
        }

        function submit() {
            $http
                .get('/api/authenticate')
                .success(function (data, status, headers, config) {
                    localStorageService.set('token', headers('x-auth-token'));

                    $rootScope.isAuthenticated = true;
                    //vm.isAuthenticated = true;
                    //var encodedProfile = data.token.split('.')[1];
                    //var profile = JSON.parse(url_base64_decode(encodedProfile));
                    vm.welcome = 'Welcome ' + data; //profile.firstName + ' ' + profile.lastName + '. Click the Restricted Link to ping the restricted api.';
                })
                .error(function (data, status, headers, config) {
                    // Erase the token if the user fails to log in
                    localStorageService.clearAll();
                    $rootScope.isAuthenticated = false;

                    // Handle login errors here
                    vm.error = 'Error: Invalid user or password';
                    vm.welcome = '';
                });
        }

        function logout() {
            vm.welcome = '';
            vm.message = '';
            $rootScope.isAuthenticated = false;
            localStorageService.clearAll();

            $http
                .get('/api/logout')
                .success(function (data, status, headers, config) {
                    vm.welcome = '';
                    vm.message = '';
                    $rootScope.isAuthenticated = false;
                    localStorageService.clearAll();
                })
                .error(function (data, status, headers, config) {
                    // Erase the token if the user fails to log out
                    localStorageService.clearAll();
                    $rootScope.isAuthenticated = false;

                    // Handle logout errors here
                    vm.error = 'Error: Invalid user or password';
                    vm.welcome = '';
                });
        }

        function callRestricted() {
            $http
                .get('/api/secure')
                .success(function (data, status, headers, config) {
                    vm.message = vm.message + ' ' + data.name;
                })
                .error(function (data, status, headers, config) {
                    //toastr.error('failed: ' + data);
                    //interceptor is handling the alert
                });
        }

        function callAdmin() {
            $http
                .get('/api/admin')
                .success(function (data, status, headers, config) {
                    vm.message = vm.message + ' ' + data.name;
                })
                .error(function (data, status, headers, config) {
                    //toastr.error('failed: ' + data);
                    //interceptor is handling the alert
                });
        }

        //this is used to parse the profile
        function url_base64_decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output); //polyfill https://github.com/davidchambers/Base64.js
        }
    }
})();