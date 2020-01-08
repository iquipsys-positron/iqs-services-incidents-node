import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { IncidentV1 } from '../data/version1/IncidentV1';

export interface IIncidentsController {
    getIncidents(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<IncidentV1>) => void): void;

    getIncidentsCount(correlationId: string, filter: FilterParams, 
        callback: (err: any, count: number) => void): void;
    
    getIncidentById(correlationId: string, incident_id: string, 
        callback: (err: any, incident: IncidentV1) => void): void;

    createIncident(correlationId: string, incident: IncidentV1, 
        callback: (err: any, incident: IncidentV1) => void): void;

    closeIncident(correlationId: string, incident_id: string,
        user: any, resolutionId: string, resolution: string, 
        callback: (err: any, incident: IncidentV1) => void): void;

    deleteIncidentById(correlationId: string, incident_id: string,
        callback: (err: any, incident: IncidentV1) => void): void;

    deleteExpired(correlationId: string, callback: (err: any) => void): void;
}
