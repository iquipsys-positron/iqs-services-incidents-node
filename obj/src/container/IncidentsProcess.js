"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const iqs_clients_opevents_node_1 = require("iqs-clients-opevents-node");
const IncidentsServiceFactory_1 = require("../build/IncidentsServiceFactory");
class IncidentsProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("incidents", "Incidents microservice");
        this._factories.add(new iqs_clients_opevents_node_1.OperationalEventsClientFactory);
        this._factories.add(new IncidentsServiceFactory_1.IncidentsServiceFactory);
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory);
    }
}
exports.IncidentsProcess = IncidentsProcess;
//# sourceMappingURL=IncidentsProcess.js.map