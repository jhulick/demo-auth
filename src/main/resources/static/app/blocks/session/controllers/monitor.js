(function() {
    'use strict';

    angular
        .module('app.session', ['ngIdle', 'ui.bootstrap'])
        .controller('Monitor', Monitor)
        .config(function($idleProvider, $keepaliveProvider) {
            $idleProvider.idleDuration(5);
            $idleProvider.warningDuration(5);
            $keepaliveProvider.interval(10);
        });;

    /* @ngInject */
    function Monitor($scope, $idle, $keepalive, $modal, logger) {

        /*jshint validthis: true */
        var vm = this;

        $scope.started = false;

        function closeModals() {
            if ($scope.warning) {
                $scope.warning.close();
                $scope.warning = null;
            }

            if ($scope.timedout) {
                $scope.timedout.close();
                $scope.timedout = null;
            }
        }

        $scope.$on('$idleStart', function() {
            closeModals();

            $scope.warning = $modal.open({
                templateUrl: 'warning-dialog.html',
                windowClass: 'modal-danger'
            });
        });

        $scope.$on('$idleEnd', function() {
            closeModals();
        });

        $scope.$on('$idleTimeout', function() {
            closeModals();
            $scope.timedout = $modal.open({
                templateUrl: 'timedout-dialog.html',
                windowClass: 'modal-danger'
            });
        });

        activate();

        function activate() {
            return start().then(function() {
                logger.info('Activated Monitor View');
            });
        }

        function start() {
            closeModals();
            $idle.watch();
            $scope.started = true;
        }

        function stop() {
            closeModals();
            $idle.unwatch();
            $scope.started = false;
        }
    }


})();