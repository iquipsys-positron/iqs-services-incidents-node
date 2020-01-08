import { IStringIdentifiable } from 'pip-services3-commons-node';
export declare class IncidentV1 implements IStringIdentifiable {
    id: string;
    org_id: string;
    create_time?: Date;
    closed?: boolean;
    close_time?: Date;
    closer_id?: string;
    closer_name?: string;
    event_id: string;
    rule_id: string;
    severity: number;
    time: Date;
    pos?: any;
    group_id?: string;
    object_id?: string;
    assign_id?: string;
    loc_id?: string;
    zone_id?: string;
    resolution?: string;
    resolution_id?: string;
    description: string;
    expected_value?: any;
    actual_value?: any;
    value_units?: string;
}
