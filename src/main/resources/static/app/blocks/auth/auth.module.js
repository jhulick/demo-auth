
(function() {
    'use strict';

    angular.module('blocks.auth', [
        'LocalStorageModule',
        'ui.router',
        'ngResource'
    ]);

        //.config(['$injector', /*'CAS',*/ AuthMaxProvider]);

    //function AuthMaxProvider(CAS) {
//        CAS.addStrategy({
//            name: 'max',
//            service: 'CASMax'
//        });
//    }

})();
