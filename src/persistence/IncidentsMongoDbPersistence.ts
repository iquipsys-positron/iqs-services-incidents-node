let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { AnyValueMap } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';

import { IncidentV1 } from '../data/version1/IncidentV1';
import { IIncidentsPersistence } from './IIncidentsPersistence';

export class IncidentsMongoDbPersistence
    extends IdentifiableMongoDbPersistence<IncidentV1, string>
    implements IIncidentsPersistence {

    constructor() {
        super('incidents');
        super.ensureIndex({ org_id: 1, time: -1 });
        this._maxPageSize = 1000;
    }
    
    private composeFilter(filter: any) {
        filter = filter || new FilterParams();

        let criteria = [];

        let search = filter.getAsNullableString('search');
        if (search != null) {
            let searchRegex = new RegExp(search, "i");
            let searchCriteria = [];
            searchCriteria.push({ description: { $regex: searchRegex } });
            criteria.push({ $or: searchCriteria });
        }

        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });

        let ruleId = filter.getAsNullableString('rule_id');
        if (ruleId != null)
            criteria.push({ rule_id: ruleId });

        let orgId = filter.getAsNullableString('org_id');
        if (orgId != null)
            criteria.push({ org_id: orgId });

        let objectId = filter.getAsNullableString('object_id');
        if (objectId != null) {
            criteria.push({ 
                $or: [ 
                    { object_id: objectId },
                    { assign_id: objectId }
                ]
            });
        }

        let groupId = filter.getAsNullableString('group_id');
        if (groupId != null)
            criteria.push({ group_id: groupId });

        let eventId = filter.getAsNullableString('event_id');
        if (eventId != null)
            criteria.push({ event_id: eventId });
                
        let closed = filter.getAsBooleanWithDefault('closed', false);
        if (!closed)
            criteria.push({ closed: false });

        let minSeverity = filter.getAsNullableInteger('min_severity');
        if (minSeverity != null)
            criteria.push({ severity: { $gte: minSeverity } });

        let fromTime = filter.getAsNullableDateTime('from_time');
        if (fromTime != null)
            criteria.push({ time: { $gte: fromTime } });

        let toTime = filter.getAsNullableDateTime('to_time');
        if (toTime != null)
            criteria.push({ time: { $lt: toTime } });

        return criteria.length > 0 ? { $and: criteria } : null;
    }
    
    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<IncidentV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, '-time', null, callback);
    }

    public getCountByFilter(correlationId: string, filter: FilterParams,
        callback: (err: any, count: number) => void): void {

        let criteria = this.composeFilter(filter);

        this._collection.countDocuments(criteria, (err, result) => {
            callback(err, result);
        });
    }

    public closeById(correlationId: string, id: string, userId: string,
        resolutionId: string, resolution: string,
        callback: (err: any, item: IncidentV1) => void): void {
        let data: AnyValueMap = AnyValueMap.fromTuples(
            'closer_id', userId,
            'closed', true,
            'close_time', new Date(),
            'resolution', resolution,
            'resolution_id', resolutionId
        );

        super.updatePartially(correlationId, id, data, callback);
    }

    public deleteExpired(correlationId: string, expireTime: Date,
        callback: (err: any) => void): void {

        let criteria = {
            time: { $lt: expireTime }
        };

        this._collection.deleteMany(criteria, (err, result) => {
            if (err == null && result && result.deletedCount > 0)
                this._logger.debug(correlationId, 'Deleted expired %d incidents', result.deletedCount);
            if (callback) callback(err);
        });
    }

}
