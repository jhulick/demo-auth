(function() {
    'use strict';

    angular
        .module('app.grid')
        .controller('Grid', Grid);

    /* @ngInject */
    function Grid($q, dataservice, logger) {
        /*jshint validthis: true */
        var vm = this;

        vm.news = {
            title: 'Grid',
            description: 'Grid is now in production!'
        };
        vm.customerCount = 0;
        vm.peopleCount = 0;
        vm.customers = [];
        vm.people = [];
        vm.data = [];
        vm.title = 'Grid';

        activate();

        function activate() {
            var promises = [getGridData()];
            return $q.all(promises).then(function() {
                logger.info('Activated Grid View');
            });
        }

        vm.customerGridOpts = {
            paging: true,
            lengthChange: true,
            searching: true,
            info: true,
            autoWidth: true,
            deferRender: true,
            processing: false,
            serverSide: false,
            data: vm.data,
            //scrollX: true,
            //scrollCollapse: true,
            //            breezeRemote: {
            //                prefetchPages: 3,
            //                //method: 'POST',
            //                sendExtraData: function(data) {
            //                    return data['formFilter'];
            //                },
            //                query: dataservice.getCustomers(),
            //                entityName: "Customer",
            //                projectOnlyTableColumns: false //If true then server results will be plain objects (not breeze.Entity)
            //            },
            order: [],
            tableTools: {
                "sRowSelect": "single",
                "sSwfPath": "/scripts/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
            },
            formFilter: {
                formSelectors: ['#cust-dt-filter']
            },
            dom: "<'row'<'col-xs-6'l><'col-xs-6'f>r>" +
                "T" + //TableTools
                //                "D" + //RowDetails
                "C" + //ColVis
                "<'pull-right'A>" + //AdvancedFilter
                //                "F" + //BreezeRemote
                "J" + //ColResize
                "K" + //FormFilter
                "t" +
                "<'row'<'col-xs-6'i><'col-xs-6'p>>R"

        };

        function getGridData() {
            return vm.data = dataservice.getGridData();
        }
    }
})();
