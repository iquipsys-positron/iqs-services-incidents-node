let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { OperationalEventsNullClientV1 } from 'iqs-clients-opevents-node';

import { IncidentV1 } from '../../../src/data/version1/IncidentV1';
import { SeverityV1 } from '../../../src/data/version1/SeverityV1';
import { IncidentsMemoryPersistence } from '../../../src/persistence/IncidentsMemoryPersistence';
import { IncidentsController } from '../../../src/logic/IncidentsController';
import { IncidentsHttpServiceV1 } from '../../../src/services/version1/IncidentsHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

let INCIDENT1: IncidentV1 = {
    id: '1',
    org_id: '1',
    create_time: new Date(),
    closed: false,
    time: new Date(),
    rule_id: '1',
    event_id: '1',
    object_id: '1',
    severity: SeverityV1.Medium,
    description: 'Test incident #1'
};
let INCIDENT2: IncidentV1 = {
    id: '2',
    org_id: '1',
    create_time: new Date(),
    closed: false,
    time: new Date(),
    rule_id: '1',
    event_id: '2',
    severity: SeverityV1.High,
    description: 'Test incident #2'
};

suite('IncidentsHttpServiceV1', ()=> {    
    let service: IncidentsHttpServiceV1;
    let rest: any;

    suiteSetup((done) => {
        let persistence = new IncidentsMemoryPersistence();
        let controller = new IncidentsController();
        let eventsClient = new OperationalEventsNullClientV1();

        service = new IncidentsHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('iqs-services-opevents', 'client', 'null', 'default', '1.0'), eventsClient,
            new Descriptor('iqs-services-incidents', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('iqs-services-incidents', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('iqs-services-incidents', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });
    
    
    test('CRUD Operations', (done) => {
        let incident1, incident2: IncidentV1;

        async.series([
        // Create one incident
            (callback) => {
                rest.post('/v1/incidents/create_incident',
                    {
                        incident: INCIDENT1
                    },
                    (err, req, res, incident) => {
                        assert.isNull(err);

                        assert.isObject(incident);
                        assert.equal(incident.org_id, INCIDENT1.org_id);
                        assert.equal(incident.rule_id, INCIDENT1.rule_id);

                        incident1 = incident;

                        callback();
                    }
                );
            },
        // Create another incident
            (callback) => {
                rest.post('/v1/incidents/create_incident', 
                    {
                        incident: INCIDENT2
                    },
                    (err, req, res, incident) => {
                        assert.isNull(err);

                        assert.isObject(incident);
                        assert.equal(incident.org_id, INCIDENT2.org_id);
                        assert.equal(incident.rule_id, INCIDENT2.rule_id);

                        incident2 = incident;

                        callback();
                    }
                );
            },
        // Get all incidents
            (callback) => {
                rest.post('/v1/incidents/get_incidents',
                    {},
                    (err, req, res, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                );
            },
            // Get all incidents
            (callback) => {
                rest.post('/v1/incidents/get_incidents_count',
                    {},
                    (err, req, res, result) => {
                        assert.isNull(err);

                        assert.isObject(result);
                        assert.equal(2, result.count);

                        callback();
                    }
                );
            },
            // Update the incident
            (callback) => {
                rest.post('/v1/incidents/close_incident',
                    { 
                        incident_id: incident1.id,
                        user: { id: '1' },
                        resolution: 'Test resolution',
                        resolution_id: '1'
                    },
                    (err, req, res, incident) => {
                        assert.isNull(err);

                        assert.isObject(incident);
                        assert.equal(incident.resolution, 'Test resolution');
                        assert.isTrue(incident.closed);
                        assert.equal(incident.resolution_id, '1');

                        incident1 = incident;

                        callback();
                    }
                );
            },
        // Delete incident
            (callback) => {
                rest.post('/v1/incidents/delete_incident_by_id',
                    {
                        incident_id: incident1.id
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            },
        // Try to get delete incident
            (callback) => {
                rest.post('/v1/incidents/get_incident_by_id',
                    {
                        incident_id: incident1.id
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            }
        ], done);
    });
});