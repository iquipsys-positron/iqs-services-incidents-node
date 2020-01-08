"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_commons_node_6 = require("pip-services3-commons-node");
const pip_services3_commons_node_7 = require("pip-services3-commons-node");
const pip_services3_commons_node_8 = require("pip-services3-commons-node");
const IncidentV1Schema_1 = require("../data/version1/IncidentV1Schema");
class IncidentsCommandSet extends pip_services3_commons_node_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        // Register commands to the database
        this.addCommand(this.makeGetIncidentsCommand());
        this.addCommand(this.makeGetIncidentsCountCommand());
        this.addCommand(this.makeGetIncidentByIdCommand());
        this.addCommand(this.makeCreateIncidentCommand());
        this.addCommand(this.makeCloseIncidentCommand());
        this.addCommand(this.makeDeleteIncidentByIdCommand());
        this.addCommand(this.makeDeleteExpiredCommand());
    }
    makeGetIncidentsCommand() {
        return new pip_services3_commons_node_2.Command("get_incidents", new pip_services3_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_7.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_node_8.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.getIncidents(correlationId, filter, paging, callback);
        });
    }
    makeGetIncidentsCountCommand() {
        return new pip_services3_commons_node_2.Command("get_incidents_count", new pip_services3_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_7.FilterParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            this._logic.getIncidentsCount(correlationId, filter, (err, count) => {
                let result = err == null ? { count: count } : null;
                callback(err, result);
            });
        });
    }
    makeGetIncidentByIdCommand() {
        return new pip_services3_commons_node_2.Command("get_incident_by_id", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('incident_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let incident_id = args.getAsString("incident_id");
            this._logic.getIncidentById(correlationId, incident_id, callback);
        });
    }
    makeCreateIncidentCommand() {
        return new pip_services3_commons_node_2.Command("create_incident", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('incident', new IncidentV1Schema_1.IncidentV1Schema()), (correlationId, args, callback) => {
            let incident = args.get("incident");
            this._logic.createIncident(correlationId, incident, callback);
        });
    }
    makeCloseIncidentCommand() {
        return new pip_services3_commons_node_2.Command("close_incident", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('incident_id', pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty('user', null)
            .withRequiredProperty('resolution_id', pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty('resolution', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let incidentId = args.getAsNullableString("incident_id");
            let user = args.get("user");
            let resolutionId = args.getAsNullableString("resolution_id");
            let resolution = args.getAsNullableString("resolution");
            this._logic.closeIncident(correlationId, incidentId, user, resolutionId, resolution, callback);
        });
    }
    makeDeleteIncidentByIdCommand() {
        return new pip_services3_commons_node_2.Command("delete_incident_by_id", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('incident_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let incidentId = args.getAsNullableString("incident_id");
            this._logic.deleteIncidentById(correlationId, incidentId, callback);
        });
    }
    makeDeleteExpiredCommand() {
        return new pip_services3_commons_node_2.Command("delete_expired", new pip_services3_commons_node_5.ObjectSchema(true), (correlationId, args, callback) => {
            this._logic.deleteExpired(correlationId, (err) => {
                if (callback)
                    callback(err, null);
            });
        });
    }
}
exports.IncidentsCommandSet = IncidentsCommandSet;
//# sourceMappingURL=IncidentsCommandSet.js.map