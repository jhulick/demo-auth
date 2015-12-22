(function() {
    'use strict';

    angular
        .module('app.docs')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates(), '/docs');
    }

    function getStates() {
        return [
            {
                state: 'docs',
                config: {
                    url: '/docs',
                    templateUrl: 'app/docs/views/docs.html',
                    controller: 'Docs',
                    controllerAs: 'vm',
                    title: 'Documentation',
                    settings: {
                        nav: 5,
                        content: '<i class="fa fa-file-text"></i> Documentation'
                    }
                }
            }
        ];
    }
})();
