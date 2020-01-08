"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const IncidentsMongoDbPersistence_1 = require("../persistence/IncidentsMongoDbPersistence");
const IncidentsFilePersistence_1 = require("../persistence/IncidentsFilePersistence");
const IncidentsMemoryPersistence_1 = require("../persistence/IncidentsMemoryPersistence");
const IncidentsController_1 = require("../logic/IncidentsController");
const IncidentsHttpServiceV1_1 = require("../services/version1/IncidentsHttpServiceV1");
class IncidentsServiceFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(IncidentsServiceFactory.MemoryPersistenceDescriptor, IncidentsMemoryPersistence_1.IncidentsMemoryPersistence);
        this.registerAsType(IncidentsServiceFactory.FilePersistenceDescriptor, IncidentsFilePersistence_1.IncidentsFilePersistence);
        this.registerAsType(IncidentsServiceFactory.MongoDbPersistenceDescriptor, IncidentsMongoDbPersistence_1.IncidentsMongoDbPersistence);
        this.registerAsType(IncidentsServiceFactory.ControllerDescriptor, IncidentsController_1.IncidentsController);
        this.registerAsType(IncidentsServiceFactory.HttpServiceDescriptor, IncidentsHttpServiceV1_1.IncidentsHttpServiceV1);
    }
}
exports.IncidentsServiceFactory = IncidentsServiceFactory;
IncidentsServiceFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-incidents", "factory", "default", "default", "1.0");
IncidentsServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-incidents", "persistence", "memory", "*", "1.0");
IncidentsServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-incidents", "persistence", "file", "*", "1.0");
IncidentsServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-incidents", "persistence", "mongodb", "*", "1.0");
IncidentsServiceFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-incidents", "controller", "default", "*", "1.0");
IncidentsServiceFactory.HttpServiceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-incidents", "service", "http", "*", "1.0");
//# sourceMappingURL=IncidentsServiceFactory.js.map