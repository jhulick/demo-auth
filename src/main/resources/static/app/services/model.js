/**
 * The application data model describes all of the model classes,
 * the documents (entityTypes) and sub-documents (complexTypes)
 *
 * The metadata (see metadata.js) cover most of the model definition.
 * Here we supplement the model classes with (non-persisted) add/remove methods,
 * property aliases, and sub-document navigation properties that can't be
 * represented (yet) in Breeze metadata.
 *
 * This enrichment takes place once the metadata become available.
 * See `configureMetadataStore()`
 */
(function(angular) {
    'use strict';

    angular
        .module("app")
        .factory( 'model', model);

    model.$inject = ['breeze', 'metadata', 'util'];

    function model(breeze, metadata, util) {

        var defineProperty = util.defineProperty;

        var model = {
            addToMetadataStore: addToMetadataStore,
            Customer: Customer
        };

        return model;

        /////////////////////

        // Model classes
        function Customer() {}

        // Fill metadataStore with metadata, then enrich the types
        // with add/remove methods, property aliases, and sub-document navigation properties
        // that can't be represented (yet) in Breeze metadata.
        // See OrderItem.product for an example of such a "synthetic" navigation property
        function addToMetadataStore(metadataStore) {

            var registerType = metadataStore.registerEntityTypeCtor.bind(metadataStore);

            metadata.fillStore(metadataStore);

            registerCustomer();

            function registerCustomer() {
                registerType('Customer', Customer);

                defineProperty(Customer, "fullName", function () {
                    return this.firstName + " " + this.lastName;
                });
            }
        }
    }

}( this.angular ));
