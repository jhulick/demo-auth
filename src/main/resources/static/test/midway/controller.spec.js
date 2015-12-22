//http://www.yearofmoo.com/2013/01/full-spectrum-testing-with-angularjs-and-karma.html
//https://github.com/yearofmoo-articles/AngularJS-Testing-Article
describe('Midway: controllers and routes', function() {
    var tester;
    beforeEach(function() {
        if (tester) {
            tester.destroy();
        }
        tester = ngMidwayTester('app');
    });

    beforeEach(function() {
        module('app', specHelper.fakeLogger);

    });

    it('should load the Customers controller properly when /customers route is accessed', function(done) {
        tester.visit('/customers', function() {
            expect(tester.path()).to.equal('/customers');
            var current = tester.inject('$state').current;
            var controller = current.controller;
            expect(controller).to.equal('Customers');
            done();
        });
    });

    it('should load the Dashboard controller properly when / route is accessed', function(done) {
        tester.visit('/', function() {
            expect(tester.path()).to.equal('/');
            var current = tester.inject('$state').current;
            var controller = current.controller;
            expect(controller).to.equal('Dashboard');
            done();
        });
    });

});