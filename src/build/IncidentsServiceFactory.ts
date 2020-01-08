import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { IncidentsMongoDbPersistence } from '../persistence/IncidentsMongoDbPersistence';
import { IncidentsFilePersistence } from '../persistence/IncidentsFilePersistence';
import { IncidentsMemoryPersistence } from '../persistence/IncidentsMemoryPersistence';
import { IncidentsController } from '../logic/IncidentsController';
import { IncidentsHttpServiceV1 } from '../services/version1/IncidentsHttpServiceV1';

export class IncidentsServiceFactory extends Factory {
	public static Descriptor = new Descriptor("iqs-services-incidents", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("iqs-services-incidents", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("iqs-services-incidents", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("iqs-services-incidents", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("iqs-services-incidents", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("iqs-services-incidents", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(IncidentsServiceFactory.MemoryPersistenceDescriptor, IncidentsMemoryPersistence);
		this.registerAsType(IncidentsServiceFactory.FilePersistenceDescriptor, IncidentsFilePersistence);
		this.registerAsType(IncidentsServiceFactory.MongoDbPersistenceDescriptor, IncidentsMongoDbPersistence);
		this.registerAsType(IncidentsServiceFactory.ControllerDescriptor, IncidentsController);
		this.registerAsType(IncidentsServiceFactory.HttpServiceDescriptor, IncidentsHttpServiceV1);
	}
	
}
