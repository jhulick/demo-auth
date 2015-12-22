describe('Basics - controller w/ async dataservice:', function() {
    'use strict';

    var controller;
    var controllerName = 'basicAsyncDataController';

    beforeEach(module('basics'));

    describe('when using "real" dataservice', function() {
        var $controller, $httpBackend, $log, customersUri;

        beforeEach(inject(function(_$controller_, _$httpBackend_, _$log_, config) {
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            $log = _$log_;
            customersUri = config.apiBaseUri + 'customers';
        }));

        function createController() {
            controller = $controller(controllerName);
            try {
                // flush both $httpBackend and $q promise queues
                $httpBackend.flush();
            } catch (e) {
                $log.error(e);
            }
        }

        describe('with unprepared $httpBackend', function() {

            beforeEach(function() {
                createController();
            });

            it('the $httpBackend threw up', function() {
                expect($log.error.logs[0]).to.match(/no more request expected/i);
            });

            it('controller does not have customers', function() {
                expect(controller.customers).to.be.empty; // because getCustomers failed
            });
        });

        describe('with prepared $httpBackend', function() {

            beforeEach(function() {
                // dataservice's $http.get handler looks for 'data.data[0].data.results' (yikes!)
                // the response needs to be the single element data.data array
                var response = [
                    {data: {results: mockData.getMockCustomers()}}
                ];

                $httpBackend.whenGET(customersUri).respond(response);
                createController();
            });

            it('has customers immediately after creation', function() {
                expect(controller.customers.length).above(1);
            });
        });
    });

    describe('when create controller with mock dataservice', function() {

        beforeEach(inject(function($controller, $q, $rootScope) {

            // mock service object whose getCustomers() returns test data
            var mockAsyncDataService = {
                getCustomers: function() {
                    return $q.when(mockData.getMockCustomers());
                }
            };

            // 'local' values that the $controller service passes to
            //  the constructor instead of values from the injector
            var ctorArgs = {
                asyncDataservice: mockAsyncDataService
            };

            controller = $controller(controllerName, ctorArgs);
            $rootScope.$apply(); // flush promise queue.
        }));

        it('has customers immediately after creation', function() {
            expect(controller.customers.length).above(1);
        });

    });

    describe('when re-register with mock dataservice', function() {

        beforeEach(module(function($provide) {
            $provide.factory('asyncDataservice', mockAsyncDataService);
        }));

        beforeEach(inject(
            function($controller, $rootScope) {
                controller = $controller(controllerName);
                $rootScope.$apply(); // flush promise queue.
            }));

        it('has customers immediately after creation', function() {
            expect(controller.customers.length).above(1);
        });

        function mockAsyncDataService($q) {
            return {
                getCustomers: function() {
                    return $q.when(mockData.getMockCustomers());
                }
            };
        }
    });
});