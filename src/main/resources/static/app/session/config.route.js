(function() {
    'use strict';

    angular
        .module('app.session')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates(), '/');
    }

    function getStates() {
        return [
            {
                state: 'session',
                config: {
                    url: '/',
                    templateUrl: 'app/session/views/session.html',
                    controller: 'Session',
                    controllerAs: 'vm',
                    title: 'session',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Session'
                    }
                }
            }
        ];
    }
})();
