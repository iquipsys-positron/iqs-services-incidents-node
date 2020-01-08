import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IGetter } from 'pip-services3-data-node';
import { IWriter } from 'pip-services3-data-node';
import { IncidentV1 } from '../data/version1/IncidentV1';
export interface IIncidentsPersistence extends IGetter<IncidentV1, string>, IWriter<IncidentV1, string> {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<IncidentV1>) => void): void;
    getCountByFilter(correlationId: string, filter: FilterParams, callback: (err: any, count: number) => void): void;
    getOneById(correlationId: string, id: string, callback: (err: any, item: IncidentV1) => void): void;
    create(correlationId: string, item: IncidentV1, callback: (err: any, item: IncidentV1) => void): void;
    closeById(correlationId: string, id: string, userId: string, resolutioId: string, resolution: string, callback: (err: any, item: IncidentV1) => void): void;
    deleteById(correlationId: string, id: string, callback: (err: any, item: IncidentV1) => void): void;
    deleteExpired(correlationId: string, expireTime: Date, callback: (err: any) => void): void;
}
