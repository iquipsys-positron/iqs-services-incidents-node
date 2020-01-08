import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';
import { IncidentV1 } from '../data/version1/IncidentV1';
import { IIncidentsPersistence } from './IIncidentsPersistence';
export declare class IncidentsMongoDbPersistence extends IdentifiableMongoDbPersistence<IncidentV1, string> implements IIncidentsPersistence {
    constructor();
    private composeFilter;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<IncidentV1>) => void): void;
    getCountByFilter(correlationId: string, filter: FilterParams, callback: (err: any, count: number) => void): void;
    closeById(correlationId: string, id: string, userId: string, resolutionId: string, resolution: string, callback: (err: any, item: IncidentV1) => void): void;
    deleteExpired(correlationId: string, expireTime: Date, callback: (err: any) => void): void;
}
