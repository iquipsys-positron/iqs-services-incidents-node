import { ConfigParams } from 'pip-services3-commons-node';

import { IncidentsMemoryPersistence } from '../../src/persistence/IncidentsMemoryPersistence';
import { IncidentsPersistenceFixture } from './IncidentsPersistenceFixture';

suite('IncidentsMemoryPersistence', ()=> {
    let persistence: IncidentsMemoryPersistence;
    let fixture: IncidentsPersistenceFixture;
    
    setup((done) => {
        persistence = new IncidentsMemoryPersistence();
        persistence.configure(new ConfigParams());
        
        fixture = new IncidentsPersistenceFixture(persistence);
        
        persistence.open(null, done);
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

    test('Delete Expired', (done) => {
        fixture.testDeleteExpired(done);
    });
    
});