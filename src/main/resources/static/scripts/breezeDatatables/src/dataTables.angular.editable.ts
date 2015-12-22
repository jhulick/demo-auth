﻿///<reference path='dataTables.angular.editable.breeze.ts' />
///<reference path='dataTables.angular.editable.uiSelect2.ts' />
///<reference path='dataTables.angular.editable.angularStrap.ts' />

module dt.editable {

    //#region interfaces

    export interface IEditCtrlWrapper {
        contentBefore: any[];
        contentAfter: any[];
        attrs: any;
        ngClass: any;
    }

    export interface IEditCtrl {
        contentBefore: any[];
        contentAfter: any[];
        attrs: any;
        ngClass: any;
    }

    export interface IColumnTemplateSetupArgs {
        column: any;
        editCtrlWrapper: IEditCtrlWrapper;
        editCtrl: IEditCtrl;
    }

    export interface IRowTemplateSetupArgs {
        formName: string;
        attrs: any;
        classes: string[];
        ngClass: any;
        hash: string;
        rowIndex: number;
        dataPath: number;
    }

    export interface IDataService {
        getColumnModelPath(col): string;
        removeItems(items: any[]): any[];
        rejectItems(items: any[]): any[];
        restoreRemovedItems(): any[];
        createItem(): any;
        addItem(item): void;
        validateItemProperty(column, row): ValidationError[];
        validateItem(row): ValidationError[];
        getItemPropertyValue(column, row): any;
    }

    export interface IDisplayService {
        
        cellPostLink(args: dt.ICellPostLinkArgs): void;
        setupColumnTemplate(args: IColumnTemplateSetupArgs): void;
        mergeCellErrors(errors: ValidationError[]): string;


        setupRowTemplate(args: IRowTemplateSetupArgs): void;

        mergeRowErrors(errors: ValidationError[]): string;

        selectControl(event, cell, col): void;
        getEditTemplateForType(type, col): string;
        getControlClass(): string;
        getControlWrapperClass(): string;
        
        canBlurCell(event, cell, col): boolean;
        dispose(): void;
    }

    export interface IDisplayServiceEditTypePlugin {
        getSupportedTypes(): string[];
        getEditTemplateForType(type, col): string;
        selectControl(event, cell, col): boolean;
        canBlurCell(event, cell, col): boolean;
        cellPostLink(args: dt.ICellPostLinkArgs): void;
        dispose(): void;
    }

    export interface IDisplayServiceCellValidationPlugin {
        setupColumnTemplate(args: IColumnTemplateSetupArgs): void;
        mergeErrors(errors: ValidationError[]): string;
    }

    export interface IDisplayServiceRowValidationPlugin {
        setupRowTemplate(args: IRowTemplateSetupArgs): void;
        mergeErrors(errors: ValidationError[]): string;
    }

    export interface IDisplayServiceStylePlugin {
        setupColumnTemplate(args: IColumnTemplateSetupArgs): void;
        setupRowTemplate(args: IRowTemplateSetupArgs): void;
    }

    export interface IEditor {
        initialize(): void;

        removeItems(items: any[]): any[];
        rejectItems(items: any[]): any[];
        restoreRemovedItems(): any[];
        createItem(): any;
        addItem(item): void;

        editRow(row: number): void;
        saveRow(row: number): void;
        rejectRow(row: number): void;

        cellCompile(event: ng.IAngularEvent, args: dt.ICellCompileArgs);
        cellPostLink(event: ng.IAngularEvent, args: dt.ICellPostLinkArgs);
        cellPreLink(event: ng.IAngularEvent, args: dt.ICellPreLinkArgs);

        rowCompile(event: ng.IAngularEvent, args: dt.IRowCompileArgs)
        rowPostLink(event: ng.IAngularEvent, args: dt.IRowPostLinkArgs);
        rowPreLink(event: ng.IAngularEvent, args: dt.IRowPreLinkArgs);
    }

    export interface ISettings {
        tableFocused: Function;
        itemAdded: Function;
        itemsRemoved: Function;
        itemsRejected: Function;
        itemsRestored: Function;
        itemCreated: Function;
        startEditing: Function;
        services: any;
        editor: any;
    }

    export interface ISettingsService {
    }

    export interface ISettingsDataService {
        type: any;
        settings: any;
    }

    //#endregion

    export class Editable implements ITablePlugin {

        //constants
        public static MODEL_PATH = "model_path";
        public static EDIT_CONTROL_ATTRS = "edit_control_attrs";
        public static EDIT_CONTROL_WRAPPER_ATTRS = "edit_control_wrapper_attrs";
        public static EDIT_CONTROL = "edit_control";
        public static BEFORE_EDIT_CONTROL = "<before-edit-control></before-edit-control>";
        public static AFTER_EDIT_CONTROL = "<after-edit-control></after-edit-control>";
        public static DISPLAY_CONTROL = "display_control";

        public static defaultEditTemplateWrapper = {
            tagName: 'div',
            className: '',
            attrs: {}
        }

        public static defaultEditTemplateControl = {
            tagName: 'input',
            attrs: {
                type: 'text'
            },
            className: '',
        }

        public static defaultTemplate = {
            wrapper: Editable.defaultEditTemplateWrapper,
            control: Editable.defaultEditTemplateControl
        } 

        public static defaultSettings: ISettings = {
            tableFocused: null,
            itemAdded: null,
            itemsRemoved: null,
            itemsRejected: null,
            itemsRestored: null,
            itemCreated: null,

            startEditing: null,

            services: {
                data: {
                    type: null,
                    settings: {
                        createItem: null, //needed when using breeze or jaydata adapter
                        validate: null, //needed for default adapter
                    }
                },
                display: {
                    type: null,
                    settings: {
                        controlWrapperClass: "dt-editable-control-wrapper",
                        controlClass: "dt-editable-control", //batch, inline
                        typesTemplate: { //fallback templates
                            'string': {
                            },
                            'number': {
                                control: {
                                    attrs: {
                                        type: 'number',
                                    }
                                }
                            },
                            'select': {
                                control: {
                                    tagName: 'select',
                                },
                                init: ($wrapper, $select, col) => {
                                    var editable = col.editable || {};
                                    if (editable.ngOptions)
                                        $select.attr('ng-options', editable.ngOptions);
                                    else if (editable.ngRepeat) {
                                        var value = editable.ngValue || 'item.value';
                                        var bind = editable.ngBind || 'item.name';
                                        $select.append('<option ng-repeat="' + editable.ngRepeat + '" ng-value="' + value + '" ng-bind="' + bind + '"></option>');
                                    }
                                }
                            },
                            'date': {
                                control: {
                                    attrs: {
                                        type: 'date',
                                    }
                                }
                            },
                            'time': {
                                control: {
                                    attrs: {
                                        type: 'time',
                                    }
                                }
                            },
                            'datetime': {
                                control: {
                                    attrs: {
                                        type: 'datetime-local',
                                    }
                                }
                            },
                        }
                    },
                    plugins: {
                        editTypes: [],
                        style: null,
                        cellValidation: null,
                        rowValidation: null,
                    },
                }
            },
            
            editor: {
                type: null,
                settings: {
                    cellTemplate:
                        '<div ng-if="$isInEditMode()">' + Editable.EDIT_CONTROL + '</div>' +
                        '<div ng-if="$isInEditMode() === false">' + Editable.DISPLAY_CONTROL + '</div>'
                }
            },

            startCellEditing: null,
            endCellEditing: null,
            formatMessage: (msg, ctx) => msg,
            culture: 'en',
            language: {
                'required': 'The value is required',
                'minlength': 'Minimum length is {{options}}'
            },
            validators: {}, //row validators
        }

        public settings;
        public initialized: boolean = false;
        public dt = {
            api: null,
            settings: null
        };
        private $injector: ng.auto.IInjectorService;
        private tableController: dt.ITableController;
        private i18NPlugin: dt.i18N.I18NPlugin;

        public editor: IEditor;
        public dataService: IDataService;
        public displayService: IDisplayService;
        public i18NService: dt.i18N.I18NService;

        public static $inject = ['tableController', 'i18N', '$injector'];
        constructor(tableController: TableController, i18N: dt.i18N.I18NPlugin, $injector: ng.auto.IInjectorService) {
            this.tableController = tableController;
            this.$injector = $injector;
            this.i18NPlugin = i18N;
        }

        public getEventListeners(): IEventListener[] {
            return [
                {
                    event: dt.TableController.events.cellCompile,
                    scope: () => this.editor,
                    fn: () => this.editor.cellCompile
                },
                {
                    event: dt.TableController.events.cellPostLink,
                    scope: () => this.editor,
                    fn: () => this.editor.cellPostLink
                },
                {
                    event: dt.TableController.events.cellPreLink,
                    scope: () => this.editor,
                    fn: () => this.editor.cellPreLink
                },
                {
                    event: dt.TableController.events.rowCompile,
                    scope: () => this.editor,
                    fn: () => this.editor.rowCompile
                },
                {
                    event: dt.TableController.events.rowPostLink,
                    scope: () => this.editor,                   
                    fn: () => this.editor.rowPostLink
                },
                {
                    event: dt.TableController.events.rowPreLink,
                    scope: () => this.editor,
                    fn: () => this.editor.rowPreLink
                },
                {
                    condition: () => { return (this.dataService instanceof DefaultDataSerice); },
                    event: dt.TableController.events.blocksCreated,
                    scope: () => this.dataService,
                    fn: () => (<DefaultDataSerice>this.dataService).onBlocksCreated
                }
            ];
        }

        public name: string = 'editable';

        public static isEnabled(settings): boolean {
            if ($.isPlainObject(settings.editable) || settings.editable === true)
                return true;

            var cols = settings.columns;
            for (var i = 0; i < cols.length; i++) {
                if ($.isPlainObject(cols[i].editable) || cols[i].editable === true)
                    return true;
            }
            return false;
        }

        public destroy(): void {
            this.i18NPlugin = null;
            this.$injector = null;
            this.tableController = null;
            this.editor = null;
            this.dataService = null;
            this.displayService.dispose();
            this.displayService = null;
            this.i18NService = null;
        }

        public initialize(dtSettings) {
            this.settings = $.extend(true, {}, Editable.defaultSettings, this.tableController.settings.options.editable);
            this.dt.settings = dtSettings;
            this.dt.api = dtSettings.oInstance.api();
            this.dt.settings.editable = this;
            this.setupI18NService();
            this.setupDisplayService();
            this.setupDataService();
            this.setupColumns();
            this.setupEditor();
            this.editor.initialize();
            this.prepareColumnTemplates();
            this.initialized = true;
        }

        private setupColumns() {
            var columns = this.dt.settings.aoColumns;
            for (var i = 0; i < columns.length; i++) {
                var editable = Editable.isColumnEditable(columns[i]);
                if (!editable)
                    columns[i].editable = false;
            }
        }

        private processTableAttribute(event: ng.IAngularEvent, options, propName, propVal, $node) {
            var editable, editor, validators, preventDefault = true, valPattern = /^val([a-z]+)/gi;

            if (propName == 'editorType' || propName == 'editable' || valPattern.test(propName)) {
                if (!angular.isObject(options.editable))
                    options.editable = {};
                editable = options.editable;
                validators = editable.validators = editable.validators || {};

                switch (propName) {
                    case 'editorType':
                        editor = editable.editor = editable.editor || {};
                        switch (propVal) {
                            case 'inline':
                                editor.type = dt.editable.InlineEditor;
                                break;

                            default:
                                editor.type = dt.editable.BatchEditor;
                        }
                        break;
                    case 'editable':
                        if (angular.isObject(propVal)) //if is an object let then the current object to be extended
                            preventDefault = false;
                        break;
                    default:
                        //validator
                        valPattern.lastIndex = 0; //reset the index
                        var valName = valPattern.exec(propName)[1];
                        valName = valName[0].toLowerCase() + valName.slice(1); //lower the first letter
                        valName = valName.replace(/([A-Z])/g, (v) => { return '-' + v.toLowerCase(); }); //convert ie. minLength to min-length
                        validators[valName] = propVal;
                        break;
                }

                if (preventDefault)
                    event.preventDefault();
            }
        }

        private processColumnAttribute(event: ng.IAngularEvent, column, propName, propVal, $node) {
            var editable, validators, preventDefault = true, valPattern = /^val([a-z]+)/gi;
            if (!Editable.isColumnEditable($node)) return;
            if (propName == 'editType' || propName == 'editable' || propName == 'editTemplate' || valPattern.test(propName) ||
                propName == 'ngOptions') {
                if (!angular.isObject(column.editable))
                    column.editable = {};
                editable = column.editable;
                validators = editable.validators = editable.validators || {};

                switch (propName) {
                    case 'editType':
                        editable.type = propVal;
                        break;
                    case 'editable':
                        if (angular.isObject(propVal)) //if is an object let then the current object to be extended
                            preventDefault = false;
                        break;
                    case 'editTemplate':
                        editable.template = propVal;
                        break;
                    case 'ngOptions': //for built-in select template
                        editable.ngOptions = propVal;
                        break;
                    default:
                        //validator
                        valPattern.lastIndex = 0; //reset the index
                        var valName = valPattern.exec(propName)[1];
                        valName = valName[0].toLowerCase() + valName.slice(1); //lower the first letter
                        valName = valName.replace(/([A-Z])/g, (v) => { return '-' + v.toLowerCase(); }); //convert ie. minLength to min-length
                        validators[valName] = propVal;
                        break;
                }

                if (preventDefault)
                    event.preventDefault();
            }
        }

        private prepareColumnTemplates() {
            var columns = this.dt.settings.aoColumns, col, i,
                editorSettings = this.getEditorSettings();
            for (i = 0; i < columns.length; i++) {
                col = columns[i];
                if (!Editable.isColumnEditable(col)) continue;

                //Options that can be modified by the display service
                var opts: IColumnTemplateSetupArgs = {
                    column: col,
                    editCtrlWrapper: {
                        contentBefore: [],
                        contentAfter: [],
                        attrs: {},
                        ngClass: {}
                    },
                    editCtrl: {
                        contentBefore: [],
                        contentAfter: [],
                        attrs: {},
                        ngClass: {}
                    },
                };
                opts.editCtrl.attrs.name = col.name || col.mData;

                this.displayService.setupColumnTemplate(opts);

                Editable.setNgClass(opts.editCtrlWrapper.ngClass, opts.editCtrlWrapper.attrs);
                Editable.setNgClass(opts.editCtrl.ngClass, opts.editCtrl.attrs);

                var columnModelPath = this.dataService.getColumnModelPath(col);

                var editControl = this.getColumnEditControlTemplate(col)
                    .replaceAll(Editable.MODEL_PATH, columnModelPath)
                    .replaceAll(Editable.EDIT_CONTROL_ATTRS, Editable.generateHtmlAttributes(opts.editCtrl.attrs))
                    .replaceAll(Editable.EDIT_CONTROL_WRAPPER_ATTRS, Editable.generateHtmlAttributes(opts.editCtrlWrapper.attrs))
                    .replaceAll(Editable.BEFORE_EDIT_CONTROL, opts.editCtrl.contentBefore.join(""))
                    .replaceAll(Editable.AFTER_EDIT_CONTROL, opts.editCtrl.contentAfter.join(""));

                editControl = opts.editCtrlWrapper.contentBefore.join("") + editControl + opts.editCtrlWrapper.contentAfter.join("");

                var displayControl = this.getColumnDisplayControlTemplate(col);

                var template = editorSettings.cellTemplate
                    .replaceAll(Editable.EDIT_CONTROL, editControl)
                    .replaceAll(Editable.DISPLAY_CONTROL, displayControl);

                col.cellTemplate = template;
            }
        }

        public static generateHtmlAttributes(obj): string {
            var attrs = '';
            for (var key in obj) {
                attrs += key + '="' + obj[key] + '" ';
            }
            return attrs;
        }

        public static isColumnEditable(column): boolean {
            if (angular.isFunction(column.attr)) { //column is a JQuery object, suppose that represent a th element
                return (column.attr('dt-editable') === undefined || column.attr('dt-editable').toUpperCase() !== 'FALSE')
                    && column.attr('dt-data') !== undefined
                    && (column.attr('dt-type') !== undefined || column.attr('dt-edit-type') !== undefined);
            } else
                return (column.editable !== false) && $.type(column.mData) === "string" && Editable.getColumnType(column);
        }

        public getColumnDisplayControlTemplate(col): string {
            if (col.templateHtml != null) {
                return col.templateHtml;
            } else if (col.expression != null && angular.isString(col.expression)) {
                return '<span ng-bind="' + col.expression + '"></span>';
            } else if (col.data != null) {
                var modelPath = this.dataService.getColumnModelPath(col);
                return '<span ng-bind="' + modelPath + '"></span>';
            } else if (col.defaultContent != "") {
                return col.defaultContent;
            }
            return null;
        }

        public getColumnEditControlTemplate(col): any {
            var type = Editable.getColumnType(col);
            var displayService = this.displayService;
            if (!type)
                throw 'Column type must be defined';
            type = type.toLowerCase();
            return displayService.getEditTemplateForType(type, col);
        }

        public static setNgClass(obj, target) {
            //build ngClass
            if (Object.keys(obj).length) {
                var ngClassStr = '{ ';
                for (var key in obj) {
                    ngClassStr += "'" + key + "': " + obj[key] + ', ';
                }
                ngClassStr += '}';
                if ($.isPlainObject(target))
                    target["ng-class"] = ngClassStr;
                else
                    $(target).attr('ng-class', ngClassStr);
            }
        }

        public static mergeErrors(errors: ValidationError[]): string {
            if (!errors) return null;
            var msg = ' '; //the default mesasge must be evaluated to true as the angularstrap check it at init
            for (var i = 0; i < errors.length; i++) {
                msg += errors[i].message;
                if (i < (errors.length - 1))
                    msg += '<br />';
            }
            return msg;
        }

        public static getColumnType(col) {
            var editablOpts = col.editable || {};
            return editablOpts.type || col._sManualType || col.sType || col.type;
        }

        public static getColumnTemplateSettings(col): any {
            return $.isPlainObject(col.editable) && $.isPlainObject(col.editable.template) ? col.editable.template : null;
        }

        public static getColumnEditableSettings(col): any {
            return $.isPlainObject(col.editable) ? col.editable : null;
        }

        public static fillRowValidationErrors(row, errors: ValidationError[]) {
            var columns = row.settings()[0].aoColumns;
            var i, cellScope: any, rowScope: any;
            var tr = row.node();
            var cells = $('td', tr);
            rowScope = angular.element(tr).scope();
            rowScope.$rowErrors.length = 0;
            var visColIdx = -1;
            var cellsByData = {};
            for (i=0; i < columns.length; i++) {
                if (columns[i].bVisible)
                    visColIdx++;
                cellScope = angular.element(cells[visColIdx]).scope();
                if (!cellScope.$cellErrors) continue; //not editable
                cellsByData[columns[i].mData] = cellScope;
                cellScope.$cellErrors.length = 0;
            }

            for (i = 0; i < errors.length; i++) {
                if (!cellsByData.hasOwnProperty(errors[i].property)) {
                    rowScope.$rowErrors.push(errors[i]);
                } else {
                    cellScope = cellsByData[errors[i].property];
                    cellScope.$cellErrors.push(errors[i]);
                }
            }
        }

        public static getCell(col, row): JQuery {
            var columns = row.settings()[0].aoColumns, i;
            var visColIdx = 0;
            for (i = 0; i < columns.length; i++) {
                if (columns[i].bVisible)
                    visColIdx++;
                if (columns[i] === col)
                    break;
            }
            return $('td:nth(' + visColIdx + ')', row.node());
        }

        private getEditorSettings() {
            return this.settings.editor.settings;
        }

        private setupI18NService() {
            this.i18NService = this.i18NPlugin.getI18NService();
            this.i18NService.mergeResources(this.settings.culture, this.settings.language);
        }

        private setupEditor() {
            var editor = this.settings.editor;
            var locals = {
                'tableController': this.tableController,
                'settings': editor.settings,
                'api': this.dt.api,
                'displayService': this.displayService, 
                'dataService': this.dataService
            };
            if (!editor.type) {
                editor.type = BatchEditor;
            }
            this.editor = this.$injector.instantiate(editor.type, locals);
        }

        private setupDisplayService() {
            var displayService = this.settings.services.display;
            displayService.settings.getRowValidators = () => {
                return this.settings.validators;
            };
            var locals = {
                'tableController': this.tableController,
                'settings': displayService.settings,
                'plugins': displayService.plugins,
                'i18NService': this.i18NService
            };
            if (!displayService.type) 
                displayService.type = DefaultDisplayService;
            //Instantiate the display adapter with the angular DI
            this.displayService = this.$injector.instantiate(displayService.type, locals);
        }

        private setupDataService() {
            var dataService = this.settings.services.data;
            var locals = {
                'tableController': this.tableController,
                'settings': dataService.settings,
                'api': this.dt.api,
                'i18NService': this.i18NService,
            };
            if (!dataService.type) {
                dataService.type = DefaultDataSerice;
            }
            if (dataService.type == null)
                throw 'Editable plugins requires a data adapter to be set';

            this.dataService = this.$injector.instantiate(dataService.type, locals);
        }

    }

    //Register plugin
    TableController.registerPlugin(Editable.isEnabled, Editable);


    export class ColumnAttributeProcessor extends BaseAttributeProcessor implements IColumnAttributeProcessor {
        constructor() {
            super(['editType', 'editable', 'editTemplate', /^val([a-z]+)/gi, 'ngOptions']);
        }

        public process(column, attrName: string, attrVal, $node: JQuery): void {
            var editable, validators;
            if (!angular.isObject(column.editable))
                column.editable = {};
            editable = column.editable;
            validators = editable.validators = editable.validators || {};

            switch (attrName) {
                case 'editType':
                    editable.type = attrVal;
                    break;
                case 'editable':
                    if (angular.isObject(attrVal)) //if is an object let then the current object to be extended
                        $.extend(true, editable, attrVal);
                    break;
                case 'editTemplate':
                    editable.template = attrVal;
                    break;
                case 'ngOptions': //for built-in select template
                    editable.ngOptions = attrVal;
                    break;
                default:
                    //validator
                    var pattern = this.getMatchedPattern(attrName);
                    var valName = pattern.exec(attrName)[1];
                    valName = valName[0].toLowerCase() + valName.slice(1); //lower the first letter
                    valName = valName.replace(/([A-Z])/g, (v) => { return '-' + v.toLowerCase(); }); //convert ie. minLength to min-length
                    validators[valName] = attrVal;
                    break;
            }
        }
    }

    //Register column attribute processor
    TableController.registerColumnAttrProcessor(new ColumnAttributeProcessor());


    export class TableAttributeProcessor extends BaseAttributeProcessor implements ITableAttributeProcessor {
        constructor() {
            super(['editorType', 'editable', /^val([a-z]+)/gi]);
        }

        public process(options, attrName: string, attrVal, $node: JQuery): void {
            var editable, editor, validators;
            if (!angular.isObject(options.editable))
                options.editable = {};
            editable = options.editable;
            validators = editable.validators = editable.validators || {};

            switch (attrName) {
                case 'editorType':
                    editor = editable.editor = editable.editor || {};
                    switch (attrVal) {
                        case 'inline':
                            editor.type = dt.editable.InlineEditor;
                            break;

                        default:
                            editor.type = dt.editable.BatchEditor;
                    }
                    break;
                case 'editable':
                    if (angular.isObject(attrVal)) //if is an object let then the current object to be extended
                        $.extend(true, editable, attrVal);
                    break;
                default:
                    //validator
                    var pattern = this.getMatchedPattern(attrName);
                    var valName = pattern.exec(attrName)[1];
                    valName = valName[0].toLowerCase() + valName.slice(1); //lower the first letter
                    valName = valName.replace(/([A-Z])/g, (v) => { return '-' + v.toLowerCase(); }); //convert ie. minLength to min-length
                    validators[valName] = attrVal;
                    break;
            }
        }
    }

    //Register table attribute processor
    TableController.registerTableAttrProcessor(new TableAttributeProcessor());


    //We have to use an object instead of a primitive value so that changes will be reflected to the child scopes
    export class DisplayMode {

        public name: string;

        constructor() {
            this.name = DisplayMode.ReadOnly;
        }

        public setMode(modeName: string) {
            this.name = modeName;
        }

        public static ReadOnly: string = "ReadOnly";
        public static Edit: string = "Edit";
        
    }

    export class ValidationError {
        public property: string;
        public message: string;
        public validator: Validator;

        constructor(message: string, validator: Validator, property: string = null) {
            this.message = message;
            this.validator = validator;
            this.property = property ? property : null;
        }
    }

    export class Validator {
        public name: string;
        public options: any;
        public column: any;

        constructor(name, options, column = null) {
            this.name = name;
            this.options = options;
            this.column = column;
        }

    }

    //#region Data services

    export class DefaultDataSerice implements IDataService {
        public removedItems = []; 

        public dt = {
            settings: null,
            api: null
        }
        public settings;
        public i18NService: dt.i18N.I18NService;

        public static $inject = ['api', 'settings', 'i18NService']
        constructor(api, settings, i18NService) {
            this.dt.api = api;
            this.dt.settings = api.settings()[0];
            this.settings = settings;
            this.i18NService = i18NService;
        }

        public getColumnModelPath(col): string {
            var rowDataPath = this.dt.settings.oInit.angular.rowDataPath;
            return col.data ? rowDataPath + '.' + col.data : null;
        }

        public removeItems(items: any[]): any[] {
            var removed = [];
            for (var i = 0; i < items.length; i++) {
                items[i].remove();
                removed.push(items[i]);
                this.removedItems.push(items[i].data());
            }
            return removed;
        }

        public rejectItems(items: any[]): any[]{
            for (var i = 0; i < items.length; i++) {
                var idx = items[i].index();
                var row = this.dt.settings.aoData[idx];
                angular.copy(row._aDataOrig, row._aData);
            }
            return items;
        }

        public restoreRemovedItems(): any[] {
            var restored = [];
            for (var i = 0; i < this.removedItems.length; i++) {
                var data = this.removedItems[i];
                this.dt.api.row.add(data);
                restored.push(data);
            }
            this.removedItems.length = 0;
            return restored;
        }

        public createItem(): any {
            if ($.isFunction(this.settings.createItem))
                return this.settings.createItem();
            var item = {};
            $.each(this.dt.settings.aoColumns, (i, col) => {
                if ($.type(col.mData) == 'string')
                    item[col.mData] = null;
            });
            return item;
        }

        public addItem(item): void {
            this.dt.api.row.add(item);
        }

        public validateItem(row): ValidationError[] {
            var errors: ValidationError[] = [];
            //Execute column validators
            var columns = this.getEditableColumns();
            for (var i = 0; i < columns.length; i++) {
                errors = errors.concat(this.validateItemProperty(columns[i], row));
            }

            var valMap = {};
            angular.forEach(this.settings.validators || {}, (opts, valName) => {
                valMap[valName] = opts;
            });

            //Execute row validators
            var rowScope: any = angular.element(row.node()).scope();
            var formController = rowScope.$getRowForm();
            angular.forEach(formController.$error, (valArr, valName) => {
                angular.forEach(valArr, (val) => {
                    if (val && val.$name) return; //column error
                var validator = new Validator(valName, valMap[valName] || null);
                var msg = this.i18NService.translate(valName, validator);
                errors.push(new ValidationError(msg, validator));
                });
            });

            return errors;
        }

        public validateItemProperty(column, row): ValidationError[]{
            var errors: ValidationError[] = [];
            var rowScope: any = angular.element(row.node()).scope();
            var formController = rowScope.$getRowForm();
            var inputCtrl = formController[column.name || column.mData];
            if (!inputCtrl) return errors;
            var valMap = {};
            var colSettings = Editable.getColumnEditableSettings(column) || {};
            if (angular.isObject(colSettings.validators)) {
                angular.forEach(colSettings.validators, (opts, valName) => {
                    valMap[valName] = opts;
                });
            }

            angular.forEach(inputCtrl.$error, (err, valName) => {
                if (!err) return; //no errors
                var validator = new Validator(valName, valMap[valName] || null, column);
                var msg = this.i18NService.translate(valName, validator);
                errors.push(new ValidationError(msg, validator, column.mData));
            });

            return errors;
        }

        public getItemPropertyValue(column, row): any {
            var mDataFn = this.dt.settings.oApi._fnGetObjectDataFn(column.mData);
            var cIdx = this.getColumnCurrentIndex(column);
            return mDataFn(row.data(), 'type', undefined, {
                settings: this.dt.settings,
                row: row.index(),
                col: cIdx
            });
        }

        public getColumnCurrentIndex(column): number {
            var columns = this.dt.settings.aoColumns;
            for (var i = 0; i < columns.length; i++) {
                if (columns === columns[i]) return i;
            }
            return -1;
        }

        public getEditableColumns(): any[] {
            var editableColumns = [];
            var columns = this.dt.settings.aoColumns;
            for (var i = 0; i < columns.length; i++) {
                if (Editable.isColumnEditable(columns[i]))
                    editableColumns.push(columns[i]);
            }
            return editableColumns;
        }

        public onBlocksCreated(event: ng.IAngularEvent, blocks: IBlock[]): void {
            for (var i = 0; i < blocks.length; i++) {
                var item = this.dt.settings.aoData[blocks[i].index];
                item._aDataOrig = angular.copy(item._aData);
            }
        }
    }

    //#endregion

    export class InlineDisplayServiceCellValidationPlugin implements IDisplayServiceCellValidationPlugin {

        public setupColumnTemplate(args: IColumnTemplateSetupArgs): void {
            args.editCtrl.contentAfter.push('<div dt-inline-cell-errors=""></div>');
        }

        public mergeErrors(errors: ValidationError[]): string {
            return Editable.mergeErrors(errors);
        }
    }

    export class InlineDisplayServiceRowValidationPlugin implements IDisplayServiceRowValidationPlugin {

        public setupRowTemplate(args: IRowTemplateSetupArgs): void {
            args.attrs['dt-inline-row-errors'] = "";
        }

        public mergeErrors(errors: ValidationError[]): string {
            return Editable.mergeErrors(errors);
        }
    }

    //Register plugins
    Editable.defaultSettings.services.display.plugins.cellValidation = InlineDisplayServiceCellValidationPlugin;
    Editable.defaultSettings.services.display.plugins.rowValidation = InlineDisplayServiceRowValidationPlugin;


    export class DefaultDisplayService implements IDisplayService {

        public settings;
        public pluginTypes = {};

        public stylePlugin: IDisplayServiceStylePlugin;
        public cellValidationPlugin: IDisplayServiceCellValidationPlugin;
        public rowValidationPlugin: IDisplayServiceRowValidationPlugin;

        private $injector: ng.auto.IInjectorService;
        private tableController: dt.ITableController;

        public static $inject = ['tableController', 'settings', 'plugins', '$injector']
        constructor(tableController, settings, plugins, $injector) {
            this.settings = settings;
            this.$injector = $injector;
            this.tableController = tableController;
            this.setupPlugins(plugins);
        }

        private setupPlugins(plugins) {
            var locals = {
                displayService: this,
                tableController: this.tableController
            };

            //Setup editType plugins
            angular.forEach(plugins.editTypes, pluginType => {
                var plugin: IDisplayServiceEditTypePlugin = this.$injector.instantiate(pluginType, locals);
                angular.forEach(plugin.getSupportedTypes(), type => {
                    this.pluginTypes[type] = plugin;
                });
            });

            //Style
            if (plugins.style) {
                this.stylePlugin = this.$injector.instantiate(plugins.style, locals);
            }

            //Setup validation plugins
            this.cellValidationPlugin = this.$injector.instantiate(plugins.cellValidation, locals);
            this.rowValidationPlugin = this.$injector.instantiate(plugins.rowValidation, locals);
        }

        public canBlurCell(event, cell, col): boolean {
            var type = Editable.getColumnType(col);
            if (this.pluginTypes.hasOwnProperty(type))
                return this.pluginTypes[type].canBlurCell(event, cell, col);
            return true;
        }

        public cellPostLink(args: dt.ICellPostLinkArgs): void {
            var type = Editable.getColumnType(args.column);

            if (this.pluginTypes.hasOwnProperty(type))
                this.pluginTypes[type].cellPostLink(args);
        }

        public setupRowTemplate(args: IRowTemplateSetupArgs): void {
            var validators = this.settings.getRowValidators() || {};
            if ($.isPlainObject(validators)) {
                angular.forEach(validators, (val, valName) => {
                    args.attrs[valName] = val;
                });
            }
            args.attrs['ng-model'] = args.dataPath;
            this.rowValidationPlugin.setupRowTemplate(args);
            if (this.stylePlugin)
                this.stylePlugin.setupRowTemplate(args);
        }

        public selectControl(event, cell, col): void {
            var type = Editable.getColumnType(col);

            if (this.pluginTypes.hasOwnProperty(type) && this.pluginTypes[type].selectControl(event, cell, col))
                return;  
            
            /* Capture shift+tab to match the left arrow key */
            var key = !event
                ? -2 :
                ((event.keyCode == 9 && event.shiftKey)
                    ? -1
                : event.keyCode);

            var ctrls = angular.element('.' + this.settings.controlClass, cell);
            var ctrl;
            //Shit+tab or left arrow
            if (key === -1 || key === 37) {
                ctrl = ctrls.last();
            } else {
                ctrl = ctrls.first();
            }

            ctrl.focus();
            ctrl.select();
        }

        public getControlClass(): string {
            return this.settings.controlClass;
        }

        public getControlWrapperClass(): string {
            return this.settings.controlWrapperClass;
        }

        public dispose() {
            var disposedPlugins = [];
            angular.forEach(this.pluginTypes, (plugin: IDisplayServiceEditTypePlugin) => {
                if (disposedPlugins.indexOf(plugin) >= 0) return;
                plugin.dispose();
                disposedPlugins.push(plugin);
            });
        }

        private getWrappedEditTemplate(type, template, content, col, plugin?: IDisplayServiceEditTypePlugin) {
            template = template || {};
            var wrapperOpts = $.isPlainObject(template) ? (template.wrapper || Editable.defaultEditTemplateWrapper) : Editable.defaultEditTemplateWrapper;
            var $wrapper: any = $('<' + wrapperOpts.tagName + ' />')
                .addClass(this.getControlWrapperClass())
                .attr(Editable.EDIT_CONTROL_WRAPPER_ATTRS, '')
                .attr(<Object>(wrapperOpts.attrs || {}))
                .addClass(wrapperOpts.className || '');
            $wrapper.append(Editable.BEFORE_EDIT_CONTROL);
            $wrapper.append(content);
            $wrapper.append(Editable.AFTER_EDIT_CONTROL);
            if ($.isFunction(template.init))
                template.init.call(this, $wrapper, content, col);

            //before retun we have to remove the ="" that setAttribute add after the edit attribute
            return $wrapper[0].outerHTML
                .replaceAll(Editable.EDIT_CONTROL_ATTRS + '=""', Editable.EDIT_CONTROL_ATTRS)
                .replaceAll(Editable.EDIT_CONTROL_WRAPPER_ATTRS + '=""', Editable.EDIT_CONTROL_WRAPPER_ATTRS);
        }

        public getEditTemplateForType(type, col): string {
            var template = Editable.getColumnTemplateSettings(col);

            if (this.pluginTypes.hasOwnProperty(type)) { //if a plugin is found that support the given type let the plugin make the template
                var ctrlTemplate = this.pluginTypes[type].getEditTemplateForType(type, col);
                return this.getWrappedEditTemplate(type, template, ctrlTemplate, col, this.pluginTypes[type]);
            } 

            if (!template) {
                if ($.isFunction(this.settings.typesTemplate[type]))
                    template = this.settings.typesTemplate[type];
                else if ($.isPlainObject(this.settings.typesTemplate[type]))
                    template = $.extend(true, {}, Editable.defaultTemplate, this.settings.typesTemplate[type]);
                else
                    template = this.settings.typesTemplate[type];
            }

            if ($.isFunction(template))
                return template.call(this, col);
            else if ($.isPlainObject(template)) {
                template = $.extend(true, {}, Editable.defaultTemplate, template);
                var controlOpts = template.control;
                var controlAttrs = {
                    'ng-model': Editable.MODEL_PATH
                };
                controlAttrs[Editable.EDIT_CONTROL_ATTRS] = '';

                var $control = $('<' + controlOpts.tagName + ' />')
                    .attr(controlAttrs)
                    .attr(<Object>(controlOpts.attrs || {}))
                    .addClass(this.getControlClass()) //needed for focusing
                    .addClass(controlOpts.className || '');

                return this.getWrappedEditTemplate(type, template, $control, col);

            } else if ($.type(template) === 'string')
                return template;
            else {
                throw 'Invalid cell template type';
            }
        }

        public mergeCellErrors(errors: ValidationError[]): string {
            return this.cellValidationPlugin.mergeErrors(errors);
        }

        public setupColumnTemplate(args: IColumnTemplateSetupArgs) {
            var settings = Editable.getColumnEditableSettings(args.column) || {};
            var editCtrlAttrs = args.editCtrl.attrs;
            if ($.isPlainObject(settings.validators)) {
                angular.forEach(settings.validators, (val, valName) => {
                    editCtrlAttrs[valName] = val;
                });
            }

            this.cellValidationPlugin.setupColumnTemplate(args);

            if (this.stylePlugin)
                this.stylePlugin.setupColumnTemplate(args);
        }

        public mergeRowErrors(errors: ValidationError[]): string {
            return this.rowValidationPlugin.mergeErrors(errors);
        }
    }

    //#region Commands

    //#region Edit

    export class BaseEditCommand extends dt.command.BaseCommand {

        constructor(defSettings, settings) {
            super(defSettings, settings);
        }

        public execute(scope) {
            if (scope.$isInEditMode())
                scope.$row.save();
            else
                scope.$row.edit();
        }
    }

    export class EditCommand extends BaseEditCommand {
        public static alias = 'edit';

        public static $inject = ['settings']
        constructor(settings) {
            super({
                attrs: {
                    'ng-bind': "$isInEditMode() === false ? ('Edit' | translate) : ('Save' | translate)"
                }
            }, settings);
        }
    }

    //Register commands
    dt.command.CommandTablePlugin.registerCommand(EditCommand);

    //#endregion

    //#region Remove

    export class BaseRemoveCommand extends dt.command.BaseCommand {

        constructor(defSettings, settings) {
            super(defSettings, settings);
        }

        public execute(scope) {
            scope.$row.remove();
        }
    }

    export class RemoveCommand extends BaseRemoveCommand {
        public static alias = 'remove';

        public static $inject = ['settings']
        constructor(settings) {
            super({
                attrs: {
                    'translate': ''
                },
                html: 'Remove',
            }, settings);
        }

    }

    //Register commands
    dt.command.CommandTablePlugin.registerCommand(RemoveCommand);

    //#endregion

    //#region Reject

    export class BaseRejectCommand extends dt.command.BaseCommand {

        constructor(defSettings, settings) {
            super(defSettings, settings);
        }

        public execute(scope) {
            scope.$row.reject();
        }
    }

    export class RejectCommand extends BaseRejectCommand {
        public static alias = 'reject';

        public static $inject = ['settings']
        constructor(settings) {
            super({
                attrs: {
                    'translate': ''
                },
                html: 'Reject',
            }, settings);
        }

    }

    //Register commands
    dt.command.CommandTablePlugin.registerCommand(RejectCommand);

    //#endregion

    //#endregion

    //Abstract
    export class BaseEditor implements IEditor {
        public dt = {
            settings: null,
            api: null
        }
        public type = null;
        public settings;
        public dataService: IDataService;
        public displayService: IDisplayService;

        constructor(api, settings, defaultSettings, displayService:IDisplayService, dataService: IDataService) {
            this.dt.api = api;
            this.dt.settings = api.settings()[0];
            this.dataService = dataService;
            this.displayService = displayService;
            this.settings = $.extend(true, {}, defaultSettings, settings);
        }

        public initialize(): void {

        }

        public cellCompile(event: ng.IAngularEvent, args: dt.ICellCompileArgs) {
            if (!Editable.isColumnEditable(args.column)) return;
            args.html = args.column.cellTemplate;
            delete args.attr['ng-bind'];
        }

        public cellPreLink(event: ng.IAngularEvent, args: dt.ICellPreLinkArgs) {
            if (!Editable.isColumnEditable(args.column)) return;
            var scope = args.scope;
            scope.$cellDisplayMode = new DisplayMode();
            scope.$cellErrors = [];
            scope.$getCellErrorMessage = () => {
                return this.displayService.mergeCellErrors(scope.$cellErrors);
            };
            scope.$isInEditMode = () => {
                return scope.$cellDisplayMode.name === DisplayMode.Edit ||
                    scope.$rowDisplayMode.name === DisplayMode.Edit;
            };
            scope.$getInputName = () => {
                return args.column.name || args.column.mData;
            };
            scope.$cellValidate = () => {
                var errors = this.dataService.validateItemProperty(args.column, scope.$row);
                scope.$cellErrors.length = 0;
                for (var i = 0; i < errors.length; i++) {
                    scope.$cellErrors.push(errors[i]);
                }
                return errors;
            };
            scope.$getCellState = () => {
                return scope.$getRowForm()[args.column.name || args.column.mData];
            };
        }

        public cellPostLink(event: ng.IAngularEvent, args: dt.ICellPostLinkArgs) {
            if (!Editable.isColumnEditable(args.column)) return;
            this.displayService.cellPostLink(args);
        }

        public rowCompile(event: ng.IAngularEvent, args: dt.IRowCompileArgs) {
            var formName = ('row' + args.hash + 'Form').replace(':', '');
            var attrs = {
                'ng-form': formName,
            };
            var rowSetup: IRowTemplateSetupArgs = {
                index: args.rowIndex,
                hash: args.hash,
                attrs: attrs,
                classes: [],
                ngClass: {},
                formName: formName,
                rowIndex: args.rowIndex,
                dataPath: args.dataPath
            };

            this.displayService.setupRowTemplate(rowSetup);

            var $node = $(args.node);
            $node.attr(<Object>rowSetup.attrs);
            $node.addClass(rowSetup.classes.join(' '));
            Editable.setNgClass(rowSetup.ngClass, args.node);
        }

        public rowPreLink(event: ng.IAngularEvent, args: dt.IRowPreLinkArgs) {
            var scope = args.scope;
            
            scope.$rowDisplayMode = new DisplayMode();
            scope.$rowErrors = [];
            scope.$getRowErrorMessage = () => {
                return this.displayService.mergeRowErrors(scope.$rowErrors);
            };
            scope.$isInEditMode = () => { return scope.$rowDisplayMode.name === DisplayMode.Edit; };

            scope.$rowValidate = () => {
                scope.$rowErrors.length = 0;
                var row = scope.$row;
                var errors = this.dataService.validateItem(row);
                Editable.fillRowValidationErrors(row, errors);
                return errors;
            };
            var formName = $(args.node).attr('ng-form');
            scope.$rowFormName = formName;
            scope.$getRowForm = () => {
                return scope[formName];
            }
        }

        public rowPostLink(event: ng.IAngularEvent, args: dt.IRowPostLinkArgs) {
            
        }

        public getVisibleColumn(index) {
            var columns = this.dt.settings.aoColumns;
            var visIdx = -1;
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].bVisible)
                    visIdx++;
                if (visIdx === index) return columns[i];
            }
            return null;
        }

        public getFirstRowCell(row) {
            var columns = this.dt.settings.aoColumns;
            var colIdx = 0;
            var column = null, $cell = null;
            //Get the fist cell that is editable and visible
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].bVisible) {
                    if (Editable.isColumnEditable(columns[i])) {
                        $cell = $('td', row.node()).eq(colIdx);
                        column = columns[i];
                        break;
                    }
                    colIdx++;
                }
            }
            return {
                cellIndex: colIdx,
                column: column,
                cellNode: $cell
            };
        }

        public removeItems(items: any[]): any[] {
            return this.dataService.removeItems(items);
        }

        public rejectItems(items: any[]): any[] {
            return this.dataService.rejectItems(items);
        }

        public restoreRemovedItems(): any[] {
            return this.dataService.restoreRemovedItems();
        }

        public createItem(): any {
            return this.dataService.createItem();
        }

        public addItem(item): void {
            return this.dataService.addItem(item);
        }

        public editRow(row: number): void {
            
        }

        public rejectRow(row: number): void {
            var dtRow = this.dt.api.row(row);
            this.dataService.rejectItems([dtRow]);
            var rowScope = angular.element(dtRow.node()).scope();
            if (rowScope && !rowScope.$$phase)
                rowScope.$digest();
        }

        public saveRow(row: number): void {
        }

    }

    export class BatchEditor extends BaseEditor {
        private lastFocusedCell;
        private keys;

        public static defaultSettings= {
            editEvent: 'click'
        };

        public static $inject = ['api', 'settings', 'displayService', 'dataService'];
        constructor(api, settings, displayService, dataService) {
            super(api, settings, BatchEditor.defaultSettings, displayService, dataService);
        }

        public editRow(row: number): void {
            var dtRow = this.dt.api.row(row);
            var $tr = angular.element(dtRow.node());
            var rowScope: any = $tr.scope();
            if (!rowScope)
                throw 'Row must have a scope';
            var cell = this.getFirstRowCell(dtRow);
            //delay in order if any click event triggered this function
            setTimeout(() => {
                this.keys.fnSetPosition(cell.cellNode[0]);
            }, 100);
        }

        public initialize(): void {
            this.keys = new $.fn.dataTable.KeyTable({
                datatable: this.dt.settings,
                table: this.dt.settings.nTable,
                focusEvent: this.settings.editEvent,
                form: true
            });
            var $table = $(this.dt.settings.nTable);
            var hiddenInputDiv = $table.next(); //form option create this node
            this.dt.api.one('init.dt', () => {
                $table.parent('div.dataTables_wrapper').prepend(hiddenInputDiv); //when tab press in an input right before the table the first cell in the table will be selected
            });
            $('input', hiddenInputDiv).on('focus', (e) => { //When table get focus
                if ($.isFunction(this.settings.tableFocused))
                    this.settings.tableFocused.call(this.dt.api, e);
            });
            this.keys.event.focus(null, null, this.onCellFocus.bind(this));
            this.keys.event.blur(null, null, this.onCellBlur.bind(this));
            this.keys.event.bluring(null, null, this.onCellBluring.bind(this));
        }

        public addItem(item): void {
            super.addItem(item);
            var rIdx = this.dt.settings.aoData.length - 1;
            //we have to delay in order to work correctly - we have to set the position after the digestion and datatables redraw
            setTimeout(() => {
                this.keys.fnSetPosition(0, rIdx);
            }, 100);
        }

        public onCellBluring(cell, x, y, event) {
            if (!cell) return true;
            var $cell = angular.element(cell);
            var cellScope: any = $cell.scope();
            if (!cellScope)
                throw 'Cell must have a scope';
            var col = this.getVisibleColumn(x);
            if (Editable.isColumnEditable(col) && cellScope.$cellDisplayMode.name == DisplayMode.ReadOnly) return true;
            var displayService = this.displayService;
            return displayService.canBlurCell(event, cell, col);
        }

        public onCellBlur(cell, x, y, event) {
            if (!cell) return;
            var $cell = angular.element(cell);
            var cellScope: any = $cell.scope();
            if (!cellScope)
                throw 'Cell must have a scope';
            var col = this.getVisibleColumn(x);
            var dataService = this.dataService;
            var displayService = this.displayService;
            if (Editable.isColumnEditable(col) && cellScope.$cellDisplayMode.name == DisplayMode.ReadOnly) return;

            if (!Editable.isColumnEditable(col)) return;

            if (cellScope.$cellErrors.length) {
                displayService.selectControl(event, cell, col);
            } else {
                cellScope.$cellDisplayMode.setMode(DisplayMode.ReadOnly);
            }
            cellScope.$digest();
        }

        public onCellFocus(cell, x, y, event) {
            if (cell == null) return;
            var dataService = this.dataService;
            var displayService = this.displayService;
            var $cell = angular.element(cell);
            var cellScope: any = $cell.scope();
            if (!cellScope)
                throw 'Cell must have a scope';

            var col = this.getVisibleColumn(x);

            if (Editable.isColumnEditable(col) && cellScope.$cellDisplayMode.name == DisplayMode.Edit) {
                displayService.selectControl(event, $cell, col);
                return;
            }

            //check if the previous cell has no errors
            if (this.lastFocusedCell) {
                var prevScope = this.lastFocusedCell.scope();
                if (prevScope.$cellErrors.length) {
                    this.keys.fnSetPosition(this.lastFocusedCell[0], null, event);
                    return;
                }
            }

            if (!Editable.isColumnEditable(col)) { //if the cell is not editable, get the next editable one
                if (event != null && event.type == "click") return;
                var prev = event != null && ((event.keyCode == 9 && event.shiftKey) || event.keyCode == 37); //if shift+tab or left arrow was pressed
                var cellIndex = prev
                    ? this.dt.api.cell(y, x).prev(true).index()
                    : this.dt.api.cell(y, x).next(true).index();
                this.keys.fnSetPosition(cellIndex.column, cellIndex.row, event); //TODO: handle invisible columns
                return;
            }

            this.lastFocusedCell = $cell;

            cellScope.$cellDisplayMode.setMode(DisplayMode.Edit);
            
            //We have to delay the digest in order to have the display template shown for a while 
            //so that KeyTable will not blur as the display template will not be in the dom anymore
            setTimeout(() => {
                cellScope.$digest();
                displayService.selectControl(event, $cell, col);
                cellScope.$broadcast('dt.StartEditCell');
                cellScope.$emit('dt.StartCellEdit');
            }, 100);

        }
    }

    export class InlineEditor extends BaseEditor {

        private lastFocusedCell;
        private keys;

        public static defaultSettings = {
            
        };

        public static $inject = ['api', 'settings', 'displayService', 'dataService'];
        constructor(api, settings, displayService, dataService) {
            super(api, settings, InlineEditor.defaultSettings, displayService, dataService);
        }

        public initialize(): void {
        }

        public saveRow(row: number): void {
            var dtRow = this.dt.api.row(row);
            var $tr = angular.element(dtRow.node());
            var rowScope: any = $tr.scope();
            if (!rowScope)
                throw 'Row must have a scope';

            if (!rowScope.$rowValidate().length) {
                rowScope.$rowDisplayMode.setMode(DisplayMode.ReadOnly);
            }
                
            if (!rowScope.$$phase)
                rowScope.$digest();
        }

        public editRow(row: number): void {
            var dtRow = this.dt.api.row(row);
            var $tr = angular.element(dtRow.node());
            var rowScope: any = $tr.scope();
            if (!rowScope)
                throw 'Row must have a scope';
            rowScope.$rowDisplayMode.setMode(DisplayMode.Edit);

            var cell = this.getFirstRowCell(dtRow);

            if (!rowScope.$$phase)
                rowScope.$digest();

            //We have to delay so that the controls are drawn
            setTimeout(() => {
                this.displayService.selectControl(null, cell.cellNode, cell.column);
            }, 100);
        }
    }

    class Position {

        public x: number;
        public y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        public compare(pos: Position): number {
            if (pos.y > this.y) return 1;
            if (pos.y < this.y) return -1;
            if (pos.y == this.y && pos.x == this.x) return 0;
            if (pos.x > this.x)
                return 1;
            else
                return 0;
        }
    }
}

(function (window, document, undefined) {

    angular.module('dt')
        .constant('dtInlineCellErrorsSettings', {
            error: {
                tagName: 'p',
                className: ''
            }
        })
        .directive('dtInlineCellErrors', ['dtInlineCellErrorsSettings',
            (dtInlineCellErrorsSettings) => {
                return {
                    restrict: 'A',
                    compile: (tElement, tAttrs) => {
                        angular.element(tElement)
                            .append(
                                $('<' + dtInlineCellErrorsSettings.error.tagName + '/>')
                                .attr({
                                    'ng-repeat': 'error in $cellErrors',
                                    'ng-bind': 'error.message',
                                })
                                .addClass(dtInlineCellErrorsSettings.error.className)
                            );
                        //Post compile
                        return (scope, iElement, iAttrs) => {
                            scope.$watchCollection(scope.$rowFormName + "['" + scope.$getInputName() + "'].$error", (newVal) => {
                                scope.$cellValidate();
                            });
                        }
                    }
                };
            }
        ])

        .constant('dtInlineRowErrorsSettings', {
            row: {
                attrs: {},
                className: '',
            },
            cell: {
                attrs: {},
                className: ''
            },
            error: {
                tagName: 'p',
                className: ''
            }
        })
        .directive('dtInlineRowErrors', ['$compile', 'dtInlineRowErrorsSettings',
            ($compile, dtInlineRowErrorsSettings) => {
                return {
                    restrict: 'A',
                    compile: (tElement, tAttrs) => {
                        //Post compile
                        return (scope, iElement, iAttrs) => {
                            var colNode = $('<td/>')
                                .attr('colspan', 100)
                                .attr(<Object>dtInlineRowErrorsSettings.cell.attrs)
                                .addClass(dtInlineRowErrorsSettings.cell.className)
                                .append(
                                $('<div />')
                                    .append(
                                    $('<' + dtInlineRowErrorsSettings.error.tagName + '/>')
                                        .attr({
                                            'ng-repeat': 'error in $rowErrors',
                                            'ng-bind': 'error.message',
                                        })
                                        .addClass(dtInlineRowErrorsSettings.error.className)
                                    )
                                );
                            var rowNode = $('<tr/>')
                                .attr(<Object>dtInlineRowErrorsSettings.row.attrs)
                                .addClass(dtInlineRowErrorsSettings.row.className)
                                .append(colNode);
                            var visible = false;

                            $compile(rowNode)(scope);
                            scope.$watchCollection(scope.$rowFormName + '.$error', (newVal) => {
                                var errors = scope.$rowValidate();
                                var rowData = scope.$rowData;
                                if (!rowData._details)
                                    rowData._details = $([]);
                                var details = rowData._details;
                                if ((errors.length && visible) || (!errors.length && !visible)) return;
                                //remove the node
                                if (!errors.length && visible) {
                                    angular.forEach(details, (tr, i) => {
                                        if (tr === rowNode[0])
                                            details.splice(i, 1);
                                    });
                                    visible = false;
                                    rowNode.detach();
                                }
                                else if (errors.length && !visible) {
                                    details.push(rowNode[0]);
                                    visible = true;
                                    scope.$row.child.show();
                                }
                            });
                        };
                    }
                }
            }
        ])


        .directive('dtTest', [() => {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: (scope, elm, attr, ngModelCtrl) => {
                    var name = attr.ngModel;
                    var validator = (val) => {
                        return val === 'test';
                    };
                    ngModelCtrl.$validators.dtTest = (modelValue) => {
                        scope.$watch(name + '.engine', (newVai) => {
                            ngModelCtrl.$setValidity('dtTest', validator(newVai));
                        });
                        return validator(modelValue.engine);
                    };
                }
            };
        }])

    ;


    //#region Extensions

    $.fn.DataTable.Api.register('row().edit()', function () {
        var ctx = this.settings()[0];
        ctx.editable.editor.editRow(this.index());
    });
    $.fn.DataTable.Api.register('row().reject()', function () {
        var ctx = this.settings()[0];
        ctx.editable.editor.rejectRow(this.index());
    });
    $.fn.DataTable.Api.register('row().save()', function () {
        var ctx = this.settings()[0];
        ctx.editable.editor.saveRow(this.index());
    });

    $.fn.DataTable.Api.register('row().cell()', function (column) {
        var rIdx = this.index();
        var cIdx;
        var ctx = this.settings()[0];
        var cells = ctx.aoData[rIdx].anCells;
        if ($.isNumeric(column)) {
            cIdx = parseInt(column);
            if (cIdx >= ctx.aoColumns.length) return null;
            return this.table().cell(rIdx, cIdx);
        }

        if (cells == null) return null;
        cIdx = cells.indexOf(column); //treat column as Element
        if (cIdx < 0) return null;
        return this.table().cell(rIdx, cIdx);
    });
    $.fn.DataTable.Api.register('cell().next()', function (editable) {
        var oSettings = this.settings()[0];
        var index = this.index();

        var currX = index.column;
        var currY = index.row;
        var complete = false;

        while (!complete) {
            //Try to go to the right column
            if ((currX + 1) < oSettings.aoColumns.length) {
                if (!editable || (oSettings.aoColumns[(currX + 1)].editable !== false && !!oSettings.aoColumns[(currX + 1)].mData)) {
                    complete = true;
                }
                currX++;
            }
            //Try to go to the next row
            else if ((currY + 1) < oSettings.aoData.length) {
                currX = -1;
                currY++;
            } else
                complete = true;
        }
        return this.table().cell(currY, currX);
    });
    $.fn.DataTable.Api.register('cell().prev()', function (editable) {
        var oSettings = this.settings()[0];
        var index = this.index();

        var currX = index.column;
        var currY = index.row;
        var complete = false;

        while (!complete) {
            //Try to go to the left column
            if ((currX - 1) > -1) {
                if (!editable || (oSettings.aoColumns[(currX - 1)].editable !== false && !!oSettings.aoColumns[(currX - 1)].mData)) {
                    complete = true;
                }
                currX--;
            }
            //Try to go to the prev row
            else if ((currY - 1) > -1) {
                currX = oSettings.aoColumns.length - 1;
                currY--;
            } else
                complete = true;
        }
        return this.table().cell(currY, currX);
    });
    //#endregion

    //#region TableTools buttons

    var TableTools = $.fn.DataTable.TableTools;

    if (!TableTools) return;

    //#region editable_remove
    TableTools.buttons.editable_remove = $.extend({}, TableTools.buttonBase, {
        "sButtonText": "Remove",
        "fnClick": function (nButton, oConfig) {
            if (!this.s.dt.editable)
                throw 'Editable plugin must be initialized';
            var editable = this.s.dt.editable;
            if (!editable.dataService)
                throw 'Editable plugin must have a editor set';
            var editor: dt.editable.IEditor = editable.editor;
            var settings = editable.settings;
            var api = this.s.dt.oInstance.api();
            var itemsToRemove = [];
            var data = this.s.dt.aoData;
            var i;
            for (i = (data.length-1); i >= 0; i--) {
                if (data[i]._DTTT_selected) {
                    itemsToRemove.push(api.row(i));
                }
            }
            var itemsRemoved = editor.removeItems(itemsToRemove);
            if ($.isFunction(settings.itemsRemoved))
                settings.itemsRemoved.call(editable, itemsRemoved);

            var scope = angular.element(this.s.dt.nTable).scope();
            if (scope && !scope.$$phase)
                scope.$apply();

            //If the restore deleted button is present enable it
            var idx = this.s.buttonSet.indexOf("editable_restore_removed");
            if (idx < 0 && !itemsRemoved.length) return;
            $(this.s.tags.button, this.dom.container).eq(idx).removeClass(this.classes.buttons.disabled);
        },
        "fnSelect": function (nButton, oConfig) {
            if (this.fnGetSelected().length !== 0) {
                $(nButton).removeClass(this.classes.buttons.disabled);
            } else {
                $(nButton).addClass(this.classes.buttons.disabled);
            }
        },
        "fnInit": function (nButton, oConfig) {
            $(nButton).addClass(this.classes.buttons.disabled);
        }
    });
    //#endregion

    //#region editable_restore_removed
    TableTools.buttons.editable_restore_removed = $.extend({}, TableTools.buttonBase, {
        "sButtonText": "Restore removed",
        "fnClick": function (nButton, oConfig) {
            if (!this.s.dt.editable)
                throw 'Editable plugin must be initialized';
            var editable = this.s.dt.editable;
            if (!editable.dataService)
                throw 'Editable plugin must have a editor set';
            var editor: dt.editable.IEditor = editable.editor;
            var settings = editable.settings;
            var restoredItems = editor.restoreRemovedItems();
            if ($.isFunction(settings.itemsRestored))
                settings.itemsRestored.call(editable, restoredItems);
            $(nButton).addClass(this.classes.buttons.disabled);
            
            var scope = angular.element(this.s.dt.nTable).scope();
            if (scope && !scope.$$phase)
                scope.$apply();
        },
        "fnInit": function (nButton, oConfig) {
            $(nButton).addClass(this.classes.buttons.disabled);
        }
    });
    //#endregion

    //#region editable_add
    TableTools.buttons.editable_add = $.extend({}, TableTools.buttonBase, {
        "sButtonText": "Add",
        "fnClick": function (nButton, oConfig) {
            if (!this.s.dt.editable)
                throw 'Editable plugin must be initialized';
            var editable = this.s.dt.editable;
            if (!editable.dataService)
                throw 'Editable plugin must have a editor set';
            var editor: dt.editable.IEditor = editable.editor;
            var settings = editable.settings;

            var item = editor.createItem();
            if ($.isFunction(settings.itemCreated))
                settings.itemCreated.call(editable, item);

            editor.addItem(item);

            if ($.isFunction(settings.itemAdded))
                settings.itemAdded.call(editable, item);

            var scope = angular.element(this.s.dt.nTable).scope();
            if (scope && !scope.$$phase)
                scope.$apply();
        },
        "fnInit": function (nButton, oConfig) {
            //$(nButton).addClass(this.classes.buttons.disabled);
        }
    });
    //#endregion

    //#region editable_reject
    TableTools.buttons.editable_reject = $.extend({}, TableTools.buttonBase, {
        "sButtonText": "Reject",
        "fnClick": function (nButton, oConfig) {
            if (!this.s.dt.editable)
                throw 'Editable plugin must be initialized';
            var editable = this.s.dt.editable;
            if (!editable.dataService)
                throw 'Editable plugin must have a editor set';
            var editor: dt.editable.IEditor = editable.editor;
            var settings = editable.settings;
            var api = this.s.dt.oInstance.api();
            var itemsToReject= [];
            var data = this.s.dt.aoData;
            var i;
            for (i = (data.length - 1); i >= 0; i--) {
                if (data[i]._DTTT_selected)
                    itemsToReject.push(api.row(i));
            }
            var itemsRejected = editor.rejectItems(itemsToReject);
            if ($.isFunction(settings.itemsRejected))
                settings.itemsRejected.call(editable, itemsRejected);

            var scope = angular.element(this.s.dt.nTable).scope();
            if (scope && !scope.$$phase)
                scope.$apply();
        },
        "fnSelect": function (nButton, oConfig) {
            if (this.fnGetSelected().length !== 0) {
                $(nButton).removeClass(this.classes.buttons.disabled);
            } else {
                $(nButton).addClass(this.classes.buttons.disabled);
            }
        },
        "fnInit": function (nButton, oConfig) {
            $(nButton).addClass(this.classes.buttons.disabled);
        }
    });
    //#endregion

    //#endregion

} (window, document, undefined));