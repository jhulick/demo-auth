describe('Midway: templates', function() {
    it('should load the template for the customers view properly',
        function(done) {
            var tester = ngMidwayTester('app');
            tester.visit('/customers', function() {
                var current = tester.inject('$state').current;
                var template = current.templateUrl;
                expect(template).to.match(/app\/customers\/views\/customers\.html/);

                tester.destroy();
                done();
            });
        });

    it('should load the template for the dashboard view properly',
        function(done) {
            var tester = ngMidwayTester('app');
            tester.visit('/', function() {
                var current = tester.inject('$state').current;
                var template = current.templateUrl;
                expect(template).to.match(/app\/dashboard\/views\/dashboard\.html/);
                tester.destroy();
                done();
            });
        });
});