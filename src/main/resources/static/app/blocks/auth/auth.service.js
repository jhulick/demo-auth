

/**
 * @ngdoc service
 * @name Auth
 * @description
 *     Authentication service
 */

(function() {
    'use strict';

    angular
        .module('blocks.auth')
        .factory('Auth', Auth);

    function Auth($rootScope, $state, $q, Principal, AuthServerProvider) {

        var service = {
            login: login,
            logout: logout,
            authorize: authorize
        };

        return service;

        /////////////////////////////////////////////////////////////

        function login(credentials, callback) {
            var cb = callback || angular.noop;
            var deferred = $q.defer();

            AuthServerProvider.login(credentials).then(function (data) {
                // retrieve the logged account information
                Principal.identity(true);
                deferred.resolve(data);

                return cb();
            }).catch(function (err) {
                this.logout();
                deferred.reject(err);
                return cb(err);
            }.bind(this));

            return deferred.promise;
        };

        function logout() {
            AuthServerProvider.logout();
            Principal.authenticate(null);
        };

        function authorize() {
            return Principal
                .identity()
                .then(function () {
                    var isAuthenticated = Principal.isAuthenticated();

                    if ($rootScope.toState.data.roles &&
                        $rootScope.toState.data.roles.length > 0 &&
                        !Principal.isInAnyRole($rootScope.toState.data.roles)) {

                        if (isAuthenticated) {
                            // user is signed in but not authorized for desired state
                            $state.go('accessdenied');
                        } else {
                            // user is not authenticated. stow the state they wanted before you
                            // send them to the signin state, so you can return them when you're done
                            $rootScope.returnToState = $rootScope.toState;
                            $rootScope.returnToStateParams = $rootScope.toStateParams;

                            // now, send them to the signin state so they can log in
                            $state.go('login');
                        }
                    }
                });
        };
    };
})();
