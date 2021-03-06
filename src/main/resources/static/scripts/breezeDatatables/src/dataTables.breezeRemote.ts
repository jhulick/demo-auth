﻿module dt {
    
    export class BreezeRemote {
        
        public static defaultSettings = {
            prefetchPages: 1,
            method: 'GET',
            sendExtraData: false,
            encoding: null,
            query: null, //breeze.EntityQuery
            entityManager: null, //breeze.EntityManager
            resultEntityType: null, //breeze.EntityType or string (optional, used for automaticaly detect types, alternatively can be passed by toType function of breeze.EntityType)
            projectOnlyTableColumns: false,
            beforeQueryExecution: null //function
        };
        public settings;
        public initialized: boolean = false;
        public dt = {
            api: null,
            settings: null
        };
        private cache = {
            lastRequest: null,
            lower: -1,
            upper: null,
            lastResponse: null,
            clear: false,
        };
         
        constructor(api, settings) {
            this.settings = $.extend({}, BreezeRemote.defaultSettings, settings);
            this.dt.settings = api.settings()[0];
            this.dt.api = api;
            this.registerCallbacks();
            this.dt.settings.breezeRemote = this; //save the settings so that others can use it (i.e. customAjax function)
            if (!settings.query)
                throw 'query property must be set for breezeRemote to work';
            this.settings.entityManager = settings.entityManager || settings.query.entityManager;
            this.settings.resultEntityType = settings.resultEntityType || settings.query.resultEntityType;
            if (this.settings.entityManager == null)
                throw "entity manager must be provided. Use EnitityQuery method 'using' or add a property entityManager in breezeRemote configuration";
            if (!this.dt.settings.oInit.bServerSide && !this.dt.settings.oInit.serverSide)
                throw 'serverSide option must be set to true for breezeRemote to work';
            this.dt.settings.ajax = $.proxy(this.customAjax, this);
            this.detectEntityPropertyTypes();
        }

        public initialize() {
            this.initialized = true;
            this.dt.settings.oApi._fnCallbackFire(this.dt.settings, 'breezeRemoteInitCompleted', 'breezeRemoteInitCompleted', [this]);
        }

        private makeAjaxRequest(data, fn) {
            var manager = this.settings.entityManager;
            var query = this.settings.query;
            var clientToServerNameFn = manager.metadataStore.namingConvention.clientPropertyNameToServer;
            var select = "";
            var order = "";
            var columnPredicates = [];
            var globalPredicates = [];
            var requestStart = data.start;
            var requestLength = data.length;

            if (requestStart < this.cache.lower) {
                requestStart -= (requestLength * (this.settings.prefetchPages - 1));
                if (requestStart < 0)
                    requestStart = 0;
            }
            this.cache.lower = requestStart;
            this.cache.upper = requestStart + (requestLength * this.settings.prefetchPages);
            requestLength = requestLength * this.settings.prefetchPages;

            //Clear query params
            query.orderByClause = null;
            query.parameters = {};
            query.wherePredicate = null;
            query.selectClause = null;

            //Columns
            $.each(data.columns, (i, column) => {
                if (!column.data || $.type(column.data) === 'number')
                    return;

                var serverSideName = clientToServerNameFn(column.data);
                select += serverSideName + ",";

                if (!column.searchable || !column.bSearchable)
                    return;

                //Column filter
                if (column.search.value != "") {
                    var colPred = breeze.Predicate.create(serverSideName, "contains", column.search.value);
                    columnPredicates.push(colPred);
                }

                //Global filter
                if (data.search.value != "") {
                    var globalPred = breeze.Predicate.create(serverSideName, "contains", data.search.value);
                    globalPredicates.push(globalPred);
                }
            });
            select = select.substring(0, select.length - 1); //remove the last ,

            //Order
            $.each(data.order, (i, ord) => {
                var col = data.columns[ord.column];
                if (!col.data)
                    return;
                var serverSideName = clientToServerNameFn(col.data);
                var dir = ord.dir == "desc" ? " desc" : "";
                order += serverSideName + dir + ",";
            });
            if (order.length > 0) {
                order = order.substring(0, order.length - 1); //remove the last ,
                query = query.orderBy(order);
            }

            //Predicates (join global predicates with OR and columns predicate with AND
            if (globalPredicates.length > 0)
                columnPredicates.push(breeze.Predicate.or(globalPredicates));
            if (columnPredicates.length > 0)
                query = query.where(breeze.Predicate.and(columnPredicates));

            //Pojection (If true then server results will be plain objects, not breeze.Entity-ies)
            if (this.settings.projectOnlyTableColumns === true)
                query = query.select(select);

            this.cache.lastRequest = this.getCachedRequest(data);

            var params = {};

            if (this.settings.sendExtraData)
                params['$data'] = $.isFunction(this.settings.sendExtraData) ? this.settings.sendExtraData.call(this, data) : data;
            if (this.settings.method !== 'GET') 
                params['$method'] = this.settings.method;
            if (this.settings.encoding != null)
                params['$encoding'] = this.settings.encoding;

            if ($.isFunction(this.settings.beforeQueryExecution))
                query = this.settings.beforeQueryExecution.call(this, query, data);

            if (Object.keys(params).length > 0)
                query = query.withParameters(params);

            query.skip(requestStart)
                .take(requestLength)
                .inlineCount()
                .execute()
                .then((json) => {
                var response = {
                    data: json.results,
                    draw: data.draw,
                    recordsTotal: json.inlineCount,
                    recordsFiltered: json.inlineCount
                };
                this.cache.lastResponse = response;
                fn(this.getDtResponse(response, data));
            }).catch((error) => {
                throw error;
            });
        }

        private getDtResponse(response, data) {
            var copyData = response.data.slice(0);
            if (this.cache.lower != data.start)
                copyData.splice(0, data.start - this.cache.lower);
            copyData.splice(data.length, copyData.length);

            return {
                data: copyData,
                draw: data.draw,
                recordsTotal: response.recordsTotal,
                recordsFiltered: response.recordsFiltered
            };  
        }

        //Return a deep clone of the request with removed properties that we want to ignore 
        private getCachedRequest(data) {
            var cache = $.extend(true, {}, data);
            delete cache['draw'];
            delete cache['start'];
            delete cache['length'];
            return cache;
        }

        private canGetDataFromCache(data): boolean {
            var dataEnd = data.start + data.length;
            var currentRequest = this.getCachedRequest(data);
            return !this.cache.clear &&
                this.cache.lower >= 0 &&
                data.start >= this.cache.lower &&
                dataEnd <= this.cache.upper &&
                JSON.stringify(currentRequest) === JSON.stringify(this.cache.lastRequest);
        }

        private customAjax(data, fn) {
            if (this.canGetDataFromCache(data)) {
                var json = this.getDtResponse(this.cache.lastResponse, data);
                fn(json);
            } else {
                this.cache.clear = false;
                this.makeAjaxRequest(data, fn);
            }
        }

        private getEntityPropertiesMap(entityType) {
            var propMap = {};
            var properties = entityType.getProperties();
            $.each(properties, (i, prop) => {
                var type = null;
                var isEntityType = false;
                if (prop.dataType) {
                    type = prop.dataType;
                }
                else if (prop.entityType) {
                    type = prop.entityType;
                    isEntityType = true;
                }
                propMap[prop.name] = {
                    type: type,
                    isEntityType: isEntityType
                };
            });
            return propMap;
        }

        private detectEntityPropertyTypes() {
            var resultEntityType = this.settings.resultEntityType;
            if (!resultEntityType) return;
            var entityType = $.type(resultEntityType) === 'string'
                ? this.settings.entityManager.metadataStore.getEntityType(resultEntityType, true)
                : resultEntityType;
            if (!entityType) return;

            var baseEntityPropMap = this.getEntityPropertiesMap(entityType);

            $.each(this.dt.settings.aoColumns, (i, col) => {
                if (col.sType) return; //Do not detect types if was passed on init
                if ($.type(col.mData) !== 'string') { //columns without mData are not searchable
                    col.bSearchable = col.searchable = false;
                    return;
                }
                var paths = col.mData.split('.');
                var type = null;
                var currPropMap = baseEntityPropMap;
                //mData can be Id, Order.Id, Orders[0].Id
                $.each(paths, (idx, str) => {
                    var path = str.replace(/(.*)(\[.*\])/i, '$1'); //remove []
                    var prop = currPropMap[path];
                    if (!prop) return;
                    if (!prop.isEntityType)
                        type = prop.type.name;
                    else {
                        currPropMap = this.getEntityPropertiesMap(prop.type);
                    }
                });
                if (!type)
                    col.bSearchable = col.searchable = false;
                col._sManualType = col.sType = col.type = type;
            });
        }

        private registerCallbacks() {
            
        }
    }

}

(function(window, document, undefined) {

    //Register events
    $.fn.DataTable.models.oSettings.breezeRemoteInitCompleted = [];

    //Register api function
    $.fn.DataTable.Api.prototype.breezeRemote = function (settings) {
        var breezeRemote = new dt.BreezeRemote(this, settings);
        if (this.settings()[0]._bInitComplete)
            breezeRemote.initialize();
        else
            this.one('init.dt', () => { breezeRemote.initialize(); });

        return null;
    };

    //Add as feature
    $.fn.dataTable.ext.feature.push({
        "fnInit": (oSettings) => {
            return oSettings.oInstance.api().breezeRemote(oSettings.oInit.breezeRemote);
        },
        "cFeature": "F",
        "sFeature": "BreezeRemote"
    });

} (window, document, undefined));