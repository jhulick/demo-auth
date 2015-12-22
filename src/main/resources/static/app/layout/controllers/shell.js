(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('Shell', Shell);
        //.directive('idle', function($document, $idle, $timeout, $interval){
        //    return {
        //        restrict: 'A',
        //        link: function(scope, elem, attrs) {
        //            var timeout;
        //            var timestamp = localStorage.lastEventTime;
        //
        //            // Watch for the events set in ng-idle's options
        //            // If any of them fire (considering 500ms debounce), update localStorage.lastEventTime with a current timestamp
        //            elem.on($idle._options().events, function(){
        //                if (timeout) { $timeout.cancel(timeout); }
        //                timeout = $timeout(function(){
        //                    localStorage.setItem('lastEventTime', new Date().getTime());
        //                }, 500);
        //            });
        //
        //            // Every 5s, poll localStorage.lastEventTime to see if its value is greater than the timestamp set for the last known event
        //            // If it is, reset the ng-idle timer and update the last known event timestamp to the value found in localStorage
        //            $interval(function() {
        //                if (localStorage.lastEventTime > timestamp) {
        //                    $idle.watch();
        //                    timestamp = localStorage.lastEventTime;
        //                }
        //            }, 5000);
        //        }
        //    }
        //});

    /* @ngInject */
    function Shell($scope, /*$idle,*/ $timeout, config, logger) {
        /*jshint validthis: true */
        var vm = this;

        vm.title = config.appTitle;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = true;

        activate();

        function activate() {
            logger.success(config.appTitle + ' loaded!', null);
            hideSplash();
        }

        function hideSplash() {
            //Force a 1 second delay so we can see the splash.
            $timeout(function() {
                vm.showSplash = false;
            }, 1000);
        }

        //$scope.$on('$idleStart', function() {
        //    // the user appears to have gone idle
        //    logger.info('$idleStart');
        //});

        //$scope.$on('$idleWarn', function(e, countdown) {
        //    // follows after the $idleStart event, but includes a countdown until the user is considered timed out
        //    // the countdown arg is the number of seconds remaining until then.
        //    // you can change the title or display a warning dialog from here.
        //    // you can let them resume their session by calling $idle.watch()
        //    logger.info('$idleWarn');
        //});

        //$scope.$on('$idleTimeout', function() {
        //    // the user has timed out (meaning idleDuration + warningDuration has passed without any activity)
        //    // this is where you'd log them
        //    logger.error('$idleTimeout');
        //})

        //$scope.$on('$idleEnd', function() {
        //    // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
        //    logger.success('$idleEnd');
        //});

        //$scope.$on('$keepalive', function() {
        //    // do something to keep the user's session alive
        //    logger.info('$keepalive');
        //})
    }
})();
