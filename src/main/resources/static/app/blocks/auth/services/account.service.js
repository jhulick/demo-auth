/**
 * @ngdoc service
 * @name Account
 * @description
 *     Account service
 */

(function() {
    'use strict';

    angular
        .module('blocks.auth')
        .factory('Account', Account);

    /**
     * @ngdoc method
     * @name Account
     * @description
     *     Configure the Account provider
     * @return {Object} account info
     */
    function Account($resource) {
        return $resource('api/account', {}, {
            'get': {
                method: 'GET', params: {}, isArray: false,
                interceptor: {
                    response: function (response) {
                        // expose response
                        return response;
                    }
                }
            }
        });
    };

})();
