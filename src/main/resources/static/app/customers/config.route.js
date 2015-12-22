(function() {
    'use strict';

    angular
        .module('app.customers')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'customers',
                config: {
                    url: '/customers',
                    templateUrl: 'app/customers/views/customers.html',
                    controller: 'Customers',
                    controllerAs: 'vm',
                    title: 'customers',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-group"></i> Customers'
                    }
                }
            }
        ];
    }
})();
