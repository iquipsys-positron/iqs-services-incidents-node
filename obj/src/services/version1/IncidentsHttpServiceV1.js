"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class IncidentsHttpServiceV1 extends pip_services3_rpc_node_1.CommandableHttpService {
    constructor() {
        super('v1/incidents');
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('iqs-services-incidents', 'controller', 'default', '*', '1.0'));
    }
}
exports.IncidentsHttpServiceV1 = IncidentsHttpServiceV1;
//# sourceMappingURL=IncidentsHttpServiceV1.js.map