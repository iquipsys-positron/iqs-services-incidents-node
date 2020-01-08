let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { IncidentV1 } from '../../src/data/version1/IncidentV1';
import {SeverityV1 } from '../../src/data/version1/SeverityV1';

import { IIncidentsPersistence } from '../../src/persistence/IIncidentsPersistence';

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
let INCIDENT3: IncidentV1 = {
    id: '3',
    org_id: '2',
    create_time: new Date(),
    closed: true,
    closer_id: '1',
    close_time: new Date(),
    time: new Date(new Date().getTime() + 1000),
    rule_id: '1',
    event_id: '1',
    severity: SeverityV1.Low,
    description: 'Test incident #3'
};

export class IncidentsPersistenceFixture {
    private _persistence: IIncidentsPersistence;
    
    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    private testCreateIncidents(done) {
        async.series([
        // Create one incident
            (callback) => {
                this._persistence.create(
                    null,
                    INCIDENT1,
                    (err, incident) => {
                        assert.isNull(err);

                        assert.isObject(incident);
                        assert.equal(incident.org_id, INCIDENT1.org_id);
                        assert.equal(incident.rule_id, INCIDENT1.rule_id);
                        assert.equal(incident.description, INCIDENT1.description);

                        callback();
                    }
                );
            },
        // Create another incident
            (callback) => {
                this._persistence.create(
                    null,
                    INCIDENT2,
                    (err, incident) => {
                        assert.isNull(err);

                        assert.isObject(incident);
                        assert.equal(incident.org_id, INCIDENT2.org_id);
                        assert.equal(incident.rule_id, INCIDENT2.rule_id);
                        assert.equal(incident.description, INCIDENT2.description);

                        callback();
                    }
                );
            },
        // Create yet another incident
            (callback) => {
                this._persistence.create(
                    null,
                    INCIDENT3,
                    (err, incident) => {
                        assert.isNull(err);

                        assert.isObject(incident);
                        assert.equal(incident.org_id, INCIDENT3.org_id);
                        assert.equal(incident.rule_id, INCIDENT3.rule_id);
                        assert.equal(incident.description, INCIDENT3.description);

                        callback();
                    }
                );
            }
        ], done);
    }
                
    public testCrudOperations(done) {
        let incident1: IncidentV1;

        async.series([
        // Create items
            (callback) => {
                this.testCreateIncidents(callback);
            },
        // Get all incidents
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        incident1 = page.data[0];

                        callback();
                    }
                );
            },
            // Get all count
            (callback) => {
                this._persistence.getCountByFilter(
                    null,
                    new FilterParams(),
                    (err, count) => {
                        assert.isNull(err);
                        
                        assert.equal(2, count);

                        callback();
                    }
                );
            },
            // Update the incident
            (callback) => {
                this._persistence.closeById(
                    null,
                    incident1.id, '1', '1', 'resolution',
                    (err, incident) => {
                        assert.isNull(err);

                        assert.isObject(incident);
                        assert.isTrue(incident.closed);
                        assert.equal(incident.closer_id, '1');
                        assert.equal(incident.id, incident1.id);
                        assert.equal(incident.resolution_id, '1');

                        callback();
                    }
                );
            },
        // Delete incident
            (callback) => {
                this._persistence.deleteById(
                    null,
                    incident1.id,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete incident
            (callback) => {
                this._persistence.getOneById(
                    null,
                    incident1.id,
                    (err, incident) => {
                        assert.isNull(err);

                        assert.isNull(incident || null);

                        callback();
                    }
                );
            }
        ], done);
    }

    public testGetWithFilter(done) {
        async.series([
        // Create incidents
            (callback) => {
                this.testCreateIncidents(callback);
            },
        // Get incidents filtered by org_id
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        org_id: '1'
                    }),
                    new PagingParams(),
                    (err, incidents) => {
                        assert.isNull(err);

                        assert.isObject(incidents);
                        assert.lengthOf(incidents.data, 2);

                        callback();
                    }
                );
            },
        // Get incidents by rule id
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        rule_id: '1'
                    }),
                    new PagingParams(),
                    (err, incidents) => {
                        assert.isNull(err);

                        assert.isObject(incidents);
                        assert.lengthOf(incidents.data, 2);

                        callback();
                    }
                );
            },
        // Get incidents filtered by object_id
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        object_id: '1'
                    }),
                    new PagingParams(),
                    (err, incidents) => {
                        assert.isNull(err);

                        assert.isObject(incidents);
                        assert.lengthOf(incidents.data, 1);

                        callback();
                    }
                );
            },
        // Get incidents filtered by severity
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        from_time: INCIDENT1.time,
                        to_time: INCIDENT3.time
                    }),
                    new PagingParams(),
                    (err, incidents) => {
                        assert.isNull(err);

                        assert.isObject(incidents);
                        assert.lengthOf(incidents.data, 2);

                        callback();
                    }
                );
            }
        ], done);
    }

    public testDeleteExpired(done) {
        async.series([
        // Create incidents
            (callback) => {
                this.testCreateIncidents(callback);
            },
        // Delete expired
            (callback) => {
                this._persistence.deleteExpired(
                    null,
                    new Date(),
                    (err) => {
                        assert.isNull(err);
                        callback();
                    }
                );
            },
        // Check all expired incidents were cleaned up
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    null,
                    new PagingParams(),
                    (err, incidents) => {
                        assert.isNull(err);

                        assert.isObject(incidents);
                        assert.lengthOf(incidents.data, 0);

                        callback();
                    }
                );
            }
        ], done);
    }

}
