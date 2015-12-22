describe('customers', function () {
    var htmlTemplate = 'app/customers/views/customers.html';
    var customersState = 'customers';

    describe('route', function () {
        beforeEach(function() {
            module('app', specHelper.fakeLogger);
            specHelper.injector(function($location, $rootScope, $state, $templateCache) {});
            $templateCache.put(htmlTemplate, '');
        });

        it('should map /customers state to customers View template', function () {
            var state = $state.get(customersState);
            expect(state.templateUrl).to.equal(htmlTemplate);
        });

        describe('when routing to /customers', function() {
            it('state should be customers', function () {
                $location.path('/customers');
                $rootScope.$apply();
                expect($state.current.name).to.equal(customersState);
            });

            it('template should be customers.html', function () {
                $location.path('/customers');
                $rootScope.$apply();
                expect($state.current.templateUrl).to.equal(htmlTemplate);
            });
        });

        describe('when going to state customers', function() {
            it('state should be customers', function () {
                $state.go(customersState);
                $rootScope.$apply();
                expect($state.current.name).to.equal(customersState);
            });

            it('template should be customers.html', function () {
                $state.go(customersState);
                $rootScope.$apply();
                expect($state.current.templateUrl).to.equal(htmlTemplate);
            });
        });
    });
});
