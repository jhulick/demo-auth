/**
 * @ngdoc constant
 * @name app.core
 * @description Defines the AngularJs application constants
 */
(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('toastr', toastr)
//        .constant('log4js', log4js)
        .constant('moment', moment)
        .constant('appRequires', {
            // Modules to lazy load
            modules: [
                {name: 'toastr', files: ['bower_components/toastr/toastr.js', 'bower_components/toastr/toastr.css']},
                {name: 'localytics.directives', files: ['vendor/chosen_v1.2.0/chosen.jquery.min.js', 'vendor/chosen_v1.2.0/chosen.min.css', 'vendor/angular-chosen-localytics/chosen.js']},
                {name: 'ngDialog', files: ['vendor/ngDialog/js/ngDialog.min.js', 'vendor/ngDialog/css/ngDialog.min.css', 'vendor/ngDialog/css/ngDialog-theme-default.min.css'] },
                {name: 'ngWig', files: ['vendor/ngWig/dist/ng-wig.min.js'] },
                {name: 'ngTable', files: ['vendor/ng-table/ng-table.min.js', 'vendor/ng-table/ng-table.min.css']},
                {name: 'ngTableExport', files: ['vendor/ng-table-export/ng-table-export.js']},
                {name: 'angularBootstrapNavTree', files: ['vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js', 'vendor/angular-bootstrap-nav-tree/dist/abn_tree.css']},
                {name: 'htmlSortable', files: ['vendor/html.sortable/dist/html.sortable.js', 'vendor/html.sortable/dist/html.sortable.angular.js']},
                {name: 'xeditable', files: ['vendor/angular-xeditable/dist/js/xeditable.js', 'vendor/angular-xeditable/dist/css/xeditable.css']},
                {name: 'angularFileUpload', files: ['vendor/angular-file-upload/angular-file-upload.js']},
                {name: 'ngImgCrop', files: ['vendor/ng-img-crop/compile/unminified/ng-img-crop.js', 'vendor/ng-img-crop/compile/unminified/ng-img-crop.css']},
                {name: 'ui.select', files: ['vendor/angular-ui-select/dist/select.js', 'vendor/angular-ui-select/dist/select.css']},
                {name: 'ui.codemirror', files: ['vendor/angular-ui-codemirror/ui-codemirror.js']}
            ]

        });
})();
