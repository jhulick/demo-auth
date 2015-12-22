describe('layout', function () {
    describe('sidebar', function () {
        var controller;

        beforeEach(function() {
            module('app', specHelper.fakeLogger);
            specHelper.injector(function($controller, $httpBackend, $location, $rootScope, $state) {});
        });

        beforeEach(function () {
            controller = $controller('Sidebar');
        });

        it('should have isCurrent() for / to return `current`', function () {
            $httpBackend.when('GET', 'app/dashboard/views/dashboard.html').respond(200);
            $location.path('/dashboard');
            $httpBackend.flush();
            $rootScope.$apply();
            expect(controller.isCurrent($state.current)).to.equal('current');
        });

        it('should have isCurrent() for /customers to return `customers`', function () {
            $httpBackend.when('GET', 'app/customers/views/customers.html').respond(200);
            $location.path('/customers');
            $httpBackend.flush();
            $rootScope.$apply();
            expect(controller.isCurrent($state.current)).to.equal('current');
        });

        specHelper.verifyNoOutstandingHttpRequests();
    });
});