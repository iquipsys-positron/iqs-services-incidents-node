"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_aws_node_1 = require("pip-services3-aws-node");
const iqs_clients_opevents_node_1 = require("iqs-clients-opevents-node");
const IncidentsServiceFactory_1 = require("../build/IncidentsServiceFactory");
class IncidentsLambdaFunction extends pip_services3_aws_node_1.CommandableLambdaFunction {
    constructor() {
        super("incidents", "Incidents function");
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('iqs-services-incidents', 'controller', 'default', '*', '*'));
        this._factories.add(new IncidentsServiceFactory_1.IncidentsServiceFactory());
        this._factories.add(new iqs_clients_opevents_node_1.OperationalEventsClientFactory());
    }
}
exports.IncidentsLambdaFunction = IncidentsLambdaFunction;
exports.handler = new IncidentsLambdaFunction().getHandler();
//# sourceMappingURL=IncidentsLambdaFunction.js.map