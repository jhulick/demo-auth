
/**
 * @ngdoc service
 * @name Sessions
 * @description
 *     Sessions service
 */

(function() {
    'use strict';

    angular
        .module('blocks.auth')
        .factory('Sessions', Sessions);

    /**
     * @ngdoc method
     * @name Sessions
     * @description
     *     Configure the Sessions factory
     * @return {Object} sessions response
     */
    function Sessions($resource) {
        return $resource('api/account/sessions/:series', {}, {
            'getAll': {method: 'GET', isArray: true}
        });
    };

})();



