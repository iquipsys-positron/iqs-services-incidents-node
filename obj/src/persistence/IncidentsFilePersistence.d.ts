import { ConfigParams } from 'pip-services3-commons-node';
import { JsonFilePersister } from 'pip-services3-data-node';
import { IncidentsMemoryPersistence } from './IncidentsMemoryPersistence';
import { IncidentV1 } from '../data/version1/IncidentV1';
export declare class IncidentsFilePersistence extends IncidentsMemoryPersistence {
    protected _persister: JsonFilePersister<IncidentV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
