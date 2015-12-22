
(function() {
    'use strict';

    angular
        .module('blocks.account')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates(), '/logout');
    }

    function getStates() {
        return [
            {
                state: 'logout',
                config: {
                    url: '/logout',
                    data: {
                        roles: []
                    },
                    templateUrl: 'app/dashboard/views/dashboard.html',
                    controller: 'LogoutController',
                    controllerAs: 'vm',
                    title: 'logout',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Logout'
                    }
                }
            }
        ];
    }
})();
