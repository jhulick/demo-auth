(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);

    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    var events = {
        controllerActivateSuccess: 'controller.activateSuccess',
        spinnerToggle: 'spinner.toggle'
    };

    /* @ngInject */
    function log4jsConfig(log4js) {

    }

    var config = {
        appErrorPrefix: '[MAX PaaS SPA Error]: ',
        appTitle: 'MAX PaaS Angular SPA Demo',
        events: events,
        version: '1.0.0'
    };

    core.value('config', config);

    core.constant('toastr', toastr);
    core.constant('moment', moment);

    //core.config(['exceptionConfigProvider', function (cfg) {
    //    cfg.config.appErrorPrefix = config.appErrorPrefix;
    //}]);
    //#endregion

    //#region Configure the common services via commonConfig
    //core.config(['commonConfigProvider', function (cfg) {
    //    cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
    //    cfg.config.spinnerToggleEvent = config.events.spinnerToggle;
    //}]);
    //#endregion

    core.config(configure);

    /* @ngInject */
    function configure($logProvider, routerHelperProvider, exceptionHandlerProvider /*, $ocLazyLoadProvider, appRequires , $keepaliveProvider, $idleProvider*/) {

        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        exceptionHandlerProvider.configure(config.appErrorPrefix);
        configureStateHelper();
        //configureTimeoutMonitor();


        // LAZY MODULES
        // -----------------------------------

        //$ocLazyLoadProvider.config({
        //    debug: false,
        //    events: true,
        //    modules: appRequires.modules
        //});

        ////////////////

        function configureStateHelper() {
            var resolveAlways = {
                /* @ngInject */
                ready: function (dataservice) {
                    return dataservice.ready();
                }
            };

            routerHelperProvider.configure({
                docTitle: 'MAX PaaS SPA: ',
                resolveAlways: resolveAlways
            });
        }

        //function configureTimeoutMonitor() {
        //    $idleProvider.idleDuration(20);
        //    $idleProvider.warningDuration(20);
        //    $keepaliveProvider.interval(30);
        //};
    }
})();
