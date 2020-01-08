import { ConfigParams } from 'pip-services3-commons-node';

import { IncidentsFilePersistence } from '../../src/persistence/IncidentsFilePersistence';
import { IncidentsPersistenceFixture } from './IncidentsPersistenceFixture';

suite('IncidentsFilePersistence', ()=> {
    let persistence: IncidentsFilePersistence;
    let fixture: IncidentsPersistenceFixture;
    
    setup((done) => {
        persistence = new IncidentsFilePersistence('./data/incidents.test.json');

        fixture = new IncidentsPersistenceFixture(persistence);

        persistence.open(null, (err) => {
            persistence.clear(null, done);
        });
    });
    
    teardown((done) => {
        persistence.close(null, done);
    });
        
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Get with Filters', (done) => {
        fixture.testGetWithFilter(done);
    });

});