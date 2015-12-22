(function () {
    'use strict';

    var app = angular.module('app');

    app.factory('JwtAuthInterceptor', ['$rootScope', '$q', 'localStorageService', 'toastr', JwtAuthInterceptor]);

    function JwtAuthInterceptor($rootScope, $q, localStorageService, toastr) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if (localStorageService.get('token')) {
                    config.headers.Authorization = 'Bearer ' + localStorageService.get('token');
                }
                return config;
            },
            responseError: function (rejection) {
                console.log(rejection);
                var msg = rejection.data + ': ' + rejection.config.url;
                toastr.error(msg);
                if (rejection.status === 401) {
                    // handle the case where the user is not authenticated
                }
                return $q.reject(rejection);
            }
        };
    }

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('JwtAuthInterceptor');
    });
})();