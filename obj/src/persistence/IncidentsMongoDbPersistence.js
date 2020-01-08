"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_mongodb_node_1 = require("pip-services3-mongodb-node");
class IncidentsMongoDbPersistence extends pip_services3_mongodb_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('incidents');
        super.ensureIndex({ org_id: 1, time: -1 });
        this._maxPageSize = 1000;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
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
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, '-time', null, callback);
    }
    getCountByFilter(correlationId, filter, callback) {
        let criteria = this.composeFilter(filter);
        this._collection.countDocuments(criteria, (err, result) => {
            callback(err, result);
        });
    }
    closeById(correlationId, id, userId, resolutionId, resolution, callback) {
        let data = pip_services3_commons_node_2.AnyValueMap.fromTuples('closer_id', userId, 'closed', true, 'close_time', new Date(), 'resolution', resolution, 'resolution_id', resolutionId);
        super.updatePartially(correlationId, id, data, callback);
    }
    deleteExpired(correlationId, expireTime, callback) {
        let criteria = {
            time: { $lt: expireTime }
        };
        this._collection.deleteMany(criteria, (err, result) => {
            if (err == null && result && result.deletedCount > 0)
                this._logger.debug(correlationId, 'Deleted expired %d incidents', result.deletedCount);
            if (callback)
                callback(err);
        });
    }
}
exports.IncidentsMongoDbPersistence = IncidentsMongoDbPersistence;
//# sourceMappingURL=IncidentsMongoDbPersistence.js.map