let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { AnyValueMap } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';

import { IncidentV1 } from '../data/version1/IncidentV1';
import { IIncidentsPersistence } from './IIncidentsPersistence';
import { CommandableLambdaClient } from 'pip-services3-aws-node';

export class IncidentsMemoryPersistence 
    extends IdentifiableMemoryPersistence<IncidentV1, string> 
    implements IIncidentsPersistence {

    constructor() {
        super();
        this._maxPageSize = 1000;
    }

    private matchString(value: string, search: string): boolean {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }

    private matchSearch(item: IncidentV1, search: string): boolean {
        search = search.toLowerCase();
        if (this.matchString(item.description, search))
            return true;
        return false;
    }

    private contains(array1, array2) {
        if (array1 == null || array2 == null) return false;
        
        for (let i1 = 0; i1 < array1.length; i1++) {
            for (let i2 = 0; i2 < array2.length; i2++)
                if (array1[i1] == array2[i1]) 
                    return true;
        }
        
        return false;
    }
    
    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();
        
        let search = filter.getAsNullableString('search');
        let id = filter.getAsNullableString('id');
        let ruleId = filter.getAsNullableString('rule_id');
        let objectId = filter.getAsNullableString('object_id');
        let groupId = filter.getAsNullableString('group_id');
        let zoneId = filter.getAsNullableString('zone_id');
        let eventId = filter.getAsNullableString('event_id');
        let closed = filter.getAsBooleanWithDefault('closed', false);
        let minSeverity = filter.getAsNullableInteger('min_severity');
        let fromTime = filter.getAsNullableDateTime('from_time');
        let toTime = filter.getAsNullableDateTime('to_time');
        
        return (item) => {
            if (id && item.id != id) 
                return false;
            if (ruleId && item.rule_id != ruleId) 
                return false;
            if (objectId && item.object_id != objectId && item.assign_id != objectId) 
                return false;
            if (groupId && item.group_id != groupId) 
                return false;
            if (zoneId && item.zone_id != zoneId) 
                return false;
            if (eventId && item.event_id != eventId) 
                return false;
            if (!closed && item.closed) 
                return false;
            if (minSeverity && item.severity < minSeverity) 
                return false;
            if (fromTime && item.time < fromTime) 
                return false;
            if (toTime && item.time >= toTime) 
                return false;
            if (search && !this.matchSearch(item, search)) 
                return false;
            return true; 
        };
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<IncidentV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public getCountByFilter(correlationId: string, filter: FilterParams,
        callback: (err: any, count: number) => void): void {

        let criteria = this.composeFilter(filter);
        let count = _.filter(this._items, criteria).length;

        callback(null, count);
    }

    public closeById(correlationId: string, id: string, userId: string,
        resolutionId: string, resolution: string,
        callback: (err: any, item: IncidentV1) => void): void {
        let data: AnyValueMap = AnyValueMap.fromTuples(
            'closer_id', userId,
            'closed', true,
            'close_time', new Date(),
            'resolution_id', resolutionId,
            'resolution', resolution
        );

        super.updatePartially(correlationId, id, data, callback);
    }

    public deleteExpired(correlationId: string, expireTime: Date,
        callback: (err: any) => void): void {

        let originalSize = this._items.length;
        this._items = _.filter(this._items, d => d.create_time.getTime() > expireTime.getTime());
        let deleted = originalSize - this._items.length;

        if (deleted > 0) {
            this._logger.debug(correlationId, 'Deleted % expired incidents');
            this.save(correlationId, callback);
        } else {
            if (callback) callback(null);
        }
    }
    
}
