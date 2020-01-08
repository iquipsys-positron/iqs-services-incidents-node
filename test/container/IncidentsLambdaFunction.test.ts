let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { ConsoleLogger } from 'pip-services3-components-node';

import { IncidentV1 } from '../../src/data/version1/IncidentV1';
import { SeverityV1 } from '../../src/data/version1/SeverityV1';
import { IncidentsMemoryPersistence } from '../../src/persistence/IncidentsMemoryPersistence';
import { IncidentsController } from '../../src/logic/IncidentsController';
import { IncidentsLambdaFunction } from '../../src/container/IncidentsLambdaFunction';

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

suite('IncidentsLambdaFunction', ()=> {
    let lambda: IncidentsLambdaFunction;

    suiteSetup((done) => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'persistence.descriptor', 'iqs-services-incidents:persistence:memory:default:1.0',
            'controller.descriptor', 'iqs-services-incidents:controller:default:default:1.0',
            'events.descriptor', 'iqs-services-opevents:client:null:*:1.0'
        );

        lambda = new IncidentsLambdaFunction();
        lambda.configure(config);
        lambda.open(null, done);
    });
    
    suiteTeardown((done) => {
        lambda.close(null, done);
    });
    
    test('CRUD Operations', (done) => {
        var incident1, incident2: IncidentV1;

        async.series([
        // Create one incident
            (callback) => {
                lambda.act(
                    {
                        role: 'incidents',
                        cmd: 'create_incident',
                        incident: INCIDENT1
                    },
                    (err, incident) => {
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
                lambda.act(
                    {
                        role: 'incidents',
                        cmd: 'create_incident',
                        incident: INCIDENT2
                    },
                    (err, incident) => {
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
                lambda.act(
                    {
                        role: 'incidents',
                        cmd: 'get_incidents' 
                    },
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                );
            },
            // Get all incidents count
            (callback) => {
                lambda.act(
                    {
                        role: 'incidents',
                        cmd: 'get_incidents_count' 
                    },
                    (err, result) => {
                        assert.isNull(err);

                        assert.isObject(result);
                        assert.equal(2, result.count);

                        callback();
                    }
                );
            },
        // Update the incident
            (callback) => {
                lambda.act(
                    {
                        role: 'incidents',
                        cmd: 'close_incident',
                        incident_id: incident1.id,
                        user: { id: '1' },
                        resolution: 'Test resolution',
                        resolution_id: '1'
                    },
                    (err, incident) => {
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
                lambda.act(
                    {
                        role: 'incidents',
                        cmd: 'delete_incident_by_id',
                        incident_id: incident1.id
                    },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete incident
            (callback) => {
                lambda.act(
                    {
                        role: 'incidents',
                        cmd: 'get_incident_by_id',
                        incident_id: incident1.id
                    },
                    (err, incident) => {
                        assert.isNull(err);

                        assert.isNull(incident || null);

                        callback();
                    }
                );
            }
        ], done);
    });
});