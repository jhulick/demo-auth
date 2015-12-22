describe('Midway: userservice requests', function() {
    var userservice;
    var tester;

    beforeEach(function() {
        if (tester) {
            tester.destroy();
        }
        tester = ngMidwayTester('app');
    });

    beforeEach(function() {
        userservice = tester.inject('userservice');
        expect(userservice).not.to.equal(null);
    });

    describe('getUser function', function () {
        it('should return 1 app uesr', function (done) {
            userservice.getUser().then(function(data) {
                expect(data).not.to.equal(null);
                expect(data.length).to.equal(1);
                done();
            });
            // $rootScope.$apply();
        });

        it('should contain Jeremy', function (done) {
            userservice.getUser().then(function(data) {
                expect(data).not.to.equal(null);
                var hasJeremy = data.some(function isPrime(element, index, array) {
                    return element.firstName.indexOf('Jeremy') >= 0;
                });
                expect(hasJeremy).to.be.true;
                done();
            });
            // $rootScope.$apply();
        });
    });

});