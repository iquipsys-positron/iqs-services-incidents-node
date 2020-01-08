"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class IncidentV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('id', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('org_id', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('create_time', pip_services3_commons_node_2.TypeCode.DateTime);
        this.withOptionalProperty('closed', pip_services3_commons_node_2.TypeCode.Boolean);
        this.withOptionalProperty('close_time', pip_services3_commons_node_2.TypeCode.DateTime);
        this.withOptionalProperty('closer_id', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('closer_name', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('event_id', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('rule_id', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('severity', pip_services3_commons_node_2.TypeCode.Integer);
        this.withRequiredProperty('time', pip_services3_commons_node_2.TypeCode.DateTime);
        this.withOptionalProperty('pos', null);
        this.withOptionalProperty('group_id', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('object_id', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('assign_id', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('loc_id', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('zone_id', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('resolution', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('resolution_id', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('description', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('expected_value', null);
        this.withOptionalProperty('actual_value', null);
        this.withOptionalProperty('value_units', pip_services3_commons_node_2.TypeCode.String);
    }
}
exports.IncidentV1Schema = IncidentV1Schema;
//# sourceMappingURL=IncidentV1Schema.js.map