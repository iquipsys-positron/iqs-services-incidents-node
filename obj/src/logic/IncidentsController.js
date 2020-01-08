"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const iqs_clients_opevents_node_1 = require("iqs-clients-opevents-node");
const iqs_clients_opevents_node_2 = require("iqs-clients-opevents-node");
const IncidentsCommandSet_1 = require("./IncidentsCommandSet");
class IncidentsController {
    constructor() {
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this._dependencyResolver = new pip_services3_commons_node_2.DependencyResolver(IncidentsController._defaultConfig);
        this._expireInterval = 300; // 5 min
        this._expireTimeout = 7; // 7 days
    }
    configure(config) {
        this._logger.configure(config);
        this._dependencyResolver.configure(config);
        this._expireInterval = config.getAsIntegerWithDefault('options.expire_interval', this._expireInterval);
        this._expireTimeout = config.getAsIntegerWithDefault('options.expire_timeout', this._expireTimeout);
    }
    setReferences(references) {
        this._logger.setReferences(references);
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
        this._eventsClient = this._dependencyResolver.getOneRequired('operational-events');
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new IncidentsCommandSet_1.IncidentsCommandSet(this);
        return this._commandSet;
    }
    isOpen() {
        return this._interval != null;
    }
    open(correlationId, callback) {
        this._interval = setInterval(() => {
            this._logger.debug(correlationId, 'Cleaning expired incidents');
            this.deleteExpired(correlationId, (err) => {
                if (err != null)
                    this._logger.error(correlationId, err, 'Failed to delete expired incidents');
            });
        }, this._expireInterval * 1000);
        if (callback)
            callback(null);
    }
    close(correlationId, callback) {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
        if (callback)
            callback(null);
    }
    getIncidents(correlationId, filter, paging, callback) {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    getIncidentsCount(correlationId, filter, callback) {
        this._persistence.getCountByFilter(correlationId, filter, callback);
    }
    getIncidentById(correlationId, id, callback) {
        this._persistence.getOneById(correlationId, id, callback);
    }
    fixIncident(incident) {
        if (_.isString(incident.pos))
            incident.pos = JSON.parse(incident.pos);
        incident.time = pip_services3_commons_node_4.DateTimeConverter.toDateTimeWithDefault(incident.time, new Date());
        incident.closed = incident.closed != null ? incident.closed : false;
    }
    createIncident(correlationId, incident, callback) {
        incident.create_time = new Date();
        this.fixIncident(incident);
        this._persistence.create(correlationId, incident, callback);
    }
    closeIncident(correlationId, incidentId, user, resolutionId, resolution, callback) {
        let oldIncident;
        let userId = _.isString(user) ? user : user.id;
        async.series([
            (callback) => {
                this._persistence.closeById(correlationId, incidentId, userId, resolutionId, resolution, (err, data) => {
                    oldIncident = data;
                    if (data == null && err == null) {
                        err = new pip_services3_commons_node_3.NotFoundException(correlationId, 'INCIDENT_NOT_FOUND', 'Incident ' + incidentId + ' was not found').withDetails('incident_id', incidentId);
                    }
                    callback(err);
                });
            },
            (callback) => {
                let event = {
                    id: null,
                    org_id: oldIncident.org_id,
                    create_time: new Date(),
                    creator_id: userId,
                    type: iqs_clients_opevents_node_1.OperationalEventTypeV1.Resolution,
                    time: new Date(),
                    ref_event_id: oldIncident.event_id,
                    rule_id: oldIncident.rule_id,
                    severity: iqs_clients_opevents_node_2.SeverityV1.Low,
                    description: oldIncident.description + ": " + oldIncident.resolution
                };
                this._eventsClient.logEvent(correlationId, event.org_id, event, callback);
            }
        ], (err) => {
            callback(err, oldIncident);
        });
    }
    deleteIncidentById(correlationId, id, callback) {
        this._persistence.deleteById(correlationId, id, callback);
    }
    deleteExpired(correlationId, callback) {
        let now = new Date().getTime();
        let expireTime = new Date(now - this._expireTimeout * 24 * 3600000);
        this._persistence.deleteExpired(correlationId, expireTime, callback);
    }
}
exports.IncidentsController = IncidentsController;
IncidentsController._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'iqs-services-incidents:persistence:*:*:1.0', 'dependencies.operational-events', 'iqs-services-opevents:client:*:*:1.0');
//# sourceMappingURL=IncidentsController.js.map