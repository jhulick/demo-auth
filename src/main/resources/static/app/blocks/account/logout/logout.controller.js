
(function() {
    'use strict';

    angular
        .module('blocks.account')
        .controller('LogoutController', LogoutController);

    function LogoutController(Auth) {
        Auth.logout();
    }

})();
