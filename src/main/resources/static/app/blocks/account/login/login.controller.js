(function() {
    'use strict';

    angular
        .module('blocks.account')
        .controller('LoginController', LoginController);

    function LoginController($rootScope, $scope, $timeout, Auth) {

        /*jshint validthis: true */
        var vm = this;

        vm.user = {};
        vm.errors = {};

        vm.rememberMe = true;

        $timeout(function () {
            angular.element('[ng-model="username"]').focus();
        });

        function login() {
            Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberMe: $scope.rememberMe
            }).then(function () {
                vm.authenticationError = false;
                $rootScope.back();
            }).catch(function () {
                vm.authenticationError = true;
            });
        };
    };
})();
