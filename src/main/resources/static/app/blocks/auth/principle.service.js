
(function() {
    'use strict';

    angular
        .module('blocks.auth')
        .provider('Principal', Principal);


    function Principal() {

        /**
         * @name Principal#options
         * @type {Object}
         * @propertyOf CASMax#CASMaxProvider
         */
        var opts = {
        };

        /**
         * @ngdoc function
         * @methodOf Principal
         * @name Principal#configure
         * @param  {String} cfg the config options
         * @description
         * Public provider configuration function.
         * Use within a angular.config block.
         */
        this.configure = function(cfg) {
            if (typeof cfg !== 'object') {
                throw new Error('Principal: configure expects an object');
            }
            opts = angular.extend(opts, cfg);
        }

        var _identity,
            _authenticated = false;


        /**
         * Inject services used within your service here
         */
        /* @ngInject */
        this.$get = function principle($q, Account) {

            var service = {
                isIdentityResolved: isIdentityResolved,
                isAuthenticated: isAuthenticated,
                isInRole: isInRole,
                isInAnyRole: isInAnyRole,
                authenticate: authenticate,
                identity: identity
            };

            return service;

            ////////////////////////////////////////////////////////

            function isIdentityResolved() {
                return angular.isDefined(_identity);
            };

            function isAuthenticated() {
                return _authenticated;
            };

            function isInRole(role) {
                if (!_authenticated || !_identity.roles) {
                    return false;
                }

                return _identity.roles.indexOf(role) !== -1;
            };

            function isInAnyRole(roles) {
                if (!_authenticated || !_identity.roles) {
                    return false;
                }

                for (var i = 0; i < roles.length; i++) {
                    if (this.isInRole(roles[i])) {
                        return true;
                    }
                }

                return false;
            };

            function authenticate(identity) {
                _identity = identity;
                _authenticated = identity !== null;
            };

            function identity(force) {
                var deferred = $q.defer();

                if (force === true) {
                    _identity = undefined;
                }

                // check and see if we have retrieved the identity data from the server.
                // if we have, reuse it by immediately resolving
                if (angular.isDefined(_identity)) {
                    deferred.resolve(_identity);

                    return deferred.promise;
                }

                // retrieve the identity data from the server, update the identity object, and then resolve.
                Account.get().$promise
                    .then(function (account) {
                        _identity = account.data;
                        _authenticated = true;
                        deferred.resolve(_identity);
                    })
                    .catch(function () {
                        _identity = null;
                        _authenticated = false;
                        deferred.resolve(_identity);
                    });
                return deferred.promise;
            }
        }
    };

})();
