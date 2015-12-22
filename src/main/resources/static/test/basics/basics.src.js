/* jscs: disable */
/*
 * Source for the "Basics" tests
 */

(function() {
    'use strict';

	/* Module */
    var basics = angular.module('basics', []);




	/* 'config' value */

    basics.value('config', {
	    // the base Uri for server api calls
        apiBaseUri: '/api/marvel/',
        appTitle:   'Basic Customers'
    });














	/* 'basicService' */

    basics.factory('calcService', calcService);

    // "factory" (AKA "service") to test
    // Depends upon the Angular $log service
    function calcService($log) {
        return {
            calc: calc
        };
        ///////////
        function calc(input, previousOutput){
            var inp =  +(input || 0);
            var prev = +(previousOutput || 0);
            var result = inp + prev;

            // use the dependency
            $log.debug('calc(' + input + ', ' + previousOutput + ') => '+ result);

            return result;
        }
    }














	/* 'basicController' controller (ViewModel) */

    basics.controller('basicController', basicController);

    function basicController($log) {
        /* jshint validthis:true */
        var vm = this;
        vm.customers = [];
        vm.title = 'Customers Listing';

        activate();
        ///////////
        function activate(){
            $log.debug(vm.title + ' controller activated');
        }
    }








	/* 'basicDataController' controller (ViewModel) */

    basics
    	.controller('basicDataController', basicDataController)
    	.factory('syncDataservice', syncDataservice);


    function basicDataController($log, syncDataservice) {
        /* jshint validthis:true */
        var vm = this;
        vm.customers = [];
        vm.title = 'Customers II Listing';

        activate();
        ///////////
        function activate(){
            vm.customers = syncDataservice.getCustomers();
            $log.debug(vm.title + ' controller activated');
        }
    }


    // imagine this is the REAL dataservice
    function syncDataservice() {
        return {
            getCustomers: getCustomers
        };
        ///////////
        function getCustomers(){
            throw new Error('getting Customers is way too hard');
        }
    }







	/* 'basicAsyncDataController' controller (ViewModel) */

    basics
    	.controller('basicAsyncDataController', basicAsyncDataController)
    	.factory('asyncDataservice', asyncDataservice);

    function basicAsyncDataController($log, asyncDataservice) {
        /* jshint validthis:true */
        var vm = this;
        vm.customers = [];
        vm.title = 'Customers III Listing';

        activate();
        ///////////
        function activate(){
        	// async dataservice method
            asyncDataservice.getCustomers()
            	.then(function(customers){
                	vm.customers = customers;
            	});

            $log.debug(vm.title + ' controller activated');
        }
    }

    // imagine this is the REAL dataservice
    function asyncDataservice($http, config) {
        return {
            getCustomers: getCustomers
        };
        ///////////
        function getCustomers(){

            return $http.get(config.apiBaseUri + 'customers')
                .then(function (data) {
                    return data.data[0].data.results;
                })
                .catch(function(message) {
                    throw new Error(
                        'XHR failed to get Customers\n' + message);
                });
        }
    }

}());
/* jscs: enable */
