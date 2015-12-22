/* global dataservice, */
describe('app.dashboard', function() {
    var controller;

    beforeEach(function() {
        module('app', function($provide) {
            specHelper.fakeStateProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injector(function($controller, $q, $rootScope, dataservice) {});            
    });

    beforeEach(function () {
        sinon.stub(dataservice, 'getCustomerCount', function () {
            var deferred = $q.defer();
            deferred.resolve(mockData.getMockCustomers().length);
            return deferred.promise;
        });

        sinon.stub(dataservice, 'ready', function () {
            var deferred = $q.defer();
            deferred.resolve({test: 123});
            return deferred.promise;
        });
      
        controller = $controller('Dashboard');
        $rootScope.$apply();
    });

    describe('Dashboard controller', function() {
        it('should be created successfully', function () {
            expect(controller).to.be.defined;
        });

        describe('after activate', function() {
            it('should have title of Dashboard', function () {
                expect(controller.title).to.equal('Dashboard');
            });

            it('should have news', function () {
                expect(controller.news).to.not.be.empty;
            });

            it('should have at least 1 person', function () {
                expect(controller.people).to.have.length.above(0);
            });

            it('should have People Count of 7', function () {
                expect(controller.peopleCount).to.equal(7);
            });
        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});