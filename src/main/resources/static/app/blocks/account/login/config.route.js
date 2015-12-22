
(function() {
    'use strict';

    angular
        .module('blocks.account')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates(), '/');
    }

    function getStates() {
        return [
            {
                state: 'login',
                config: {
                    url: '/',
                    data: {
                        roles: []
                    },
                    templateUrl: 'app/blocks/account/login/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm',
                    title: 'login',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Login'
                    }
                }
            }
        ];
    }
})();

