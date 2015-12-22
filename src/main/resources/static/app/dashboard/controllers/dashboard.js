(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('Dashboard', Dashboard);

    /* @ngInject */
    function Dashboard($q, dataservice, logger) {
        /*jshint validthis: true */
        var vm = this;

        vm.news = {
            title: 'Customers',
            description: 'Customers is now in production!'
        };
        vm.customerCount = 0;
        vm.peopleCount = 0;
        vm.customers = [];
        vm.people = [];
        vm.title = 'Dashboard';

        activate();

        function activate() {
            var promises = [getPeopleCount(), getPeople(), getMessageCount()];
            return $q.all(promises).then(function() {
                logger.info('Activated Dashboard View');
            });
        }

        function getMessageCount() {
            return dataservice.getMessageCount().then(function (data) {
                return vm.messageCount = data;
            });
        }

        function getPeopleCount() {
            return dataservice.getPeopleCount().then(function(data) {
                vm.peopleCount = data;
                return vm.peopleCount;
            });
        }

        function getPeople() {
            return dataservice.getPeople().then(function(data) {
                vm.people = data;
                return vm.people;
            });
        }

        function getCustomerCount() {
            return dataservice.getCustomerCount().then(function(data) {
                vm.customerCount = data;
                return vm.customerCount;
            });
        }

        function getCustomersCast() {
            return dataservice.getCustomersCast().then(function(data) {
                vm.customers = data;
                return vm.customers;
            });
        }
    }
})();
