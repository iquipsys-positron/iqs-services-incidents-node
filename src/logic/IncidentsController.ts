let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { DependencyResolver } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IOpenable } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { CompositeLogger } from 'pip-services3-components-node';
import { NotFoundException } from 'pip-services3-commons-node';
import { DateTimeConverter } from 'pip-services3-commons-node';

import { OperationalEventV1 } from 'iqs-clients-opevents-node';
import { OperationalEventTypeV1 } from 'iqs-clients-opevents-node';
import { SeverityV1 } from 'iqs-clients-opevents-node';
import { IOperationalEventsClientV1 } from 'iqs-clients-opevents-node';

import { IncidentV1 } from '../data/version1/IncidentV1';
import { IIncidentsPersistence } from '../persistence/IIncidentsPersistence';
import { IIncidentsController } from './IIncidentsController';
import { IncidentsCommandSet } from './IncidentsCommandSet';

export class IncidentsController implements  IConfigurable, IReferenceable, ICommandable, IOpenable, IIncidentsController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'iqs-services-incidents:persistence:*:*:1.0',
        'dependencies.operational-events', 'iqs-services-opevents:client:*:*:1.0'
    );

    private _logger: CompositeLogger = new CompositeLogger();
    private _dependencyResolver: DependencyResolver = new DependencyResolver(IncidentsController._defaultConfig);
    private _persistence: IIncidentsPersistence;
    private _commandSet: IncidentsCommandSet;
    private _eventsClient: IOperationalEventsClientV1;
    private _expireInterval: number = 300; // 5 min
    private _expireTimeout: number = 7; // 7 days
    private _interval: any;

    public configure(config: ConfigParams): void {
        this._logger.configure(config);
        this._dependencyResolver.configure(config);

        this._expireInterval = config.getAsIntegerWithDefault('options.expire_interval', this._expireInterval);
        this._expireTimeout = config.getAsIntegerWithDefault('options.expire_timeout', this._expireTimeout);
    }

    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<IIncidentsPersistence>('persistence');
        this._eventsClient = this._dependencyResolver.getOneRequired<IOperationalEventsClientV1>('operational-events');
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new IncidentsCommandSet(this);
        return this._commandSet;
    }
    
    public isOpen(): boolean {
        return this._interval != null;
    }

    public open(correlationId: string, callback: (err: any) => void): void {
        this._interval = setInterval(() => {
            this._logger.debug(correlationId, 'Cleaning expired incidents');
            this.deleteExpired(correlationId, (err) => {
                if (err != null)
                    this._logger.error(correlationId, err, 'Failed to delete expired incidents');
            });
        }, this._expireInterval * 1000);

        if (callback) callback(null);
    }

    public close(correlationId: string, callback: (err: any) => void): void {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }

        if (callback) callback(null);
    }

    public getIncidents(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<IncidentV1>) => void): void {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public getIncidentsCount(correlationId: string, filter: FilterParams,  
        callback: (err: any, count: number) => void): void {
        this._persistence.getCountByFilter(correlationId, filter, callback);
    }

    public getIncidentById(correlationId: string, id: string, 
        callback: (err: any, incident: IncidentV1) => void): void {
        this._persistence.getOneById(correlationId, id, callback);        
    }

    private fixIncident(incident: IncidentV1): void {
        if (_.isString(incident.pos))
            incident.pos = JSON.parse(incident.pos);

        incident.time = DateTimeConverter.toDateTimeWithDefault(incident.time, new Date());
        incident.closed = incident.closed != null ? incident.closed : false;
    }

    public createIncident(correlationId: string, incident: IncidentV1, 
        callback: (err: any, incident: IncidentV1) => void): void {

        incident.create_time = new Date();
        this.fixIncident(incident);

        this._persistence.create(correlationId, incident, callback);
    }

    public closeIncident(correlationId: string, incidentId: string,
        user: any, resolutionId: string, resolution: string, 
        callback: (err: any, incident: IncidentV1) => void): void {
        let oldIncident: IncidentV1;        
        let userId = _.isString(user) ? user : user.id;

        async.series([
            (callback) => {
                this._persistence.closeById(correlationId, incidentId, userId, resolutionId, resolution, (err, data) => {
                    oldIncident = data;
                    if (data == null && err == null) {
                        err = new NotFoundException(
                            correlationId, 
                            'INCIDENT_NOT_FOUND',
                            'Incident ' + incidentId + ' was not found'
                        ).withDetails('incident_id', incidentId);
                    }
                    callback(err);
                });
            },
            (callback) => {
                let event: OperationalEventV1 = {
                    id: null,
                    org_id: oldIncident.org_id,
                    create_time: new Date(),
                    creator_id: userId,
                    type: OperationalEventTypeV1.Resolution,
                    time: new Date(),
                    ref_event_id: oldIncident.event_id,
                    rule_id: oldIncident.rule_id,
                    severity: SeverityV1.Low,
                    description: oldIncident.description + ": " + oldIncident.resolution
                };

                this._eventsClient.logEvent(correlationId, event.org_id, event, callback);
            }
        ], (err) => {
            callback(err, oldIncident);
        });
    }

    public deleteIncidentById(correlationId: string, id: string,
        callback: (err: any, incident: IncidentV1) => void): void {  
        this._persistence.deleteById(correlationId, id, callback);
    }

    public deleteExpired(correlationId: string,
        callback: (err: any) => void): void {
        let now = new Date().getTime();
        let expireTime = new Date(now - this._expireTimeout * 24 * 3600000);
        this._persistence.deleteExpired(correlationId, expireTime, callback);
    }

}
