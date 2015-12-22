/* global dataservice, */
describe('dataservice', function () {
    var scope;
    var mocks = {};

    beforeEach(function () {
        module('app', function($provide) {
            specHelper.fakeStateProvider($provide);
            specHelper.fakeLogger($provide);
        });
        specHelper.injector(function($httpBackend, $rootScope, dataservice) {});            
        
        mocks.maaData = [{ 
            data: {results: mockData.getMockCustomers()}
        }];
        // sinon.stub(dataservice, 'getCustomers', function () {
        //     var deferred = $q.defer();
        //     deferred.resolve(mockData.getMockCustomers());
        //     return deferred.promise;
        // });
    });

    it('should be registered', function() {
        expect(dataservice).not.to.equal(null);
    });

    describe('getCustomers function', function () {
        it('should exist', function () {
            expect(dataservice.getCustomers).not.to.equal(null);
        });
        
        it('should return 5 Customers', function (done) {
            $httpBackend.when('GET', '/api/maa').respond(200, mocks.maaData);
            dataservice.getCustomers().then(function(data) {
                expect(data.length).to.equal(5);
                done();
            });
            $rootScope.$apply();
            $httpBackend.flush();
        });

        it('should contain Black Widow', function (done) {
            $httpBackend.when('GET', '/api/maa').respond(200, mocks.maaData);
            dataservice.getCustomers().then(function(data) {
                var hasBlackWidow = data.some(function isPrime(element, index, array) {
                    return element.name.indexOf('Black Widow') >= 0;
                });
                expect(hasBlackWidow).to.be.true;
                done();
            });
            $rootScope.$apply();
            $httpBackend.flush();
        });
    });

    describe('getCustomerCount function', function () {
        it('should exist', function () {
            expect(dataservice.getCustomerCount).not.to.equal(null);
        });

        it('should return 11 Customers', function (done) {
            dataservice.getCustomerCount().then(function(count) {
                expect(count).to.equal(11);
                done();
            });
            $rootScope.$apply();
        });
    });

    describe('getCustomersCast function', function () {
        it('should exist', function () {
            expect(dataservice.getCustomersCast).not.to.equal(null);
        });

        it('should return 11 Customers', function (done) {
            dataservice.getCustomersCast().then(function(data) {
                expect(data.length).to.equal(11);
                done();
            });
            $rootScope.$apply();
        });

        it('should contain Natasha', function (done) {
            dataservice.getCustomersCast()
                .then(function(data) {
                    var hasBlackWidow = data.some(function isPrime(element, index, array) {
                        return element.character.indexOf('Natasha') >= 0;
                    });
                    expect(hasBlackWidow).to.be.true;
                    done();
                });
            $rootScope.$apply();
        });
    });

    describe('ready function', function () {
        it('should exist', function () {
            expect(dataservice.ready).not.to.equal(null);
        });

        it('should return a resolved promise', function (done) {
            dataservice.ready()
                .then(function(data) {
                    expect(true).to.be.true;
                    done();
                }, function(data) {
                    expect('promise rejected').to.be.true;
                    done();
                });
            $rootScope.$apply();
        });
    });

    specHelper.verifyNoOutstandingHttpRequests();
});