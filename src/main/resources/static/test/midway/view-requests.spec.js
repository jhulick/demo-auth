describe('Midway: view requests', function() {
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

    it('should goto the dashboard by default', function(done) {
        tester.visit('/', function() {
            //expect(tester.viewElement().html()).to.contain('id="dashboard-view"');
            done();
        });
    });

    it('should have a working customers request', function(done) {
        tester.visit('/customers', function() {
            //expect(tester.viewElement().html()).to.contain('title="Customers"');
            done();
        });
    });
});