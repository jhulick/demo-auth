(function() {
    'use strict';

    angular
        .module('app.grid')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'grid',
                config: {
                    url: '/grid',
                    templateUrl: 'app/grid/views/grid.html',
                    controller: 'Grid',
                    controllerAs: 'vm',
                    title: 'grid',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-gears"></i> Grid'
                    }
                }
            }
        ];
    }
})();
