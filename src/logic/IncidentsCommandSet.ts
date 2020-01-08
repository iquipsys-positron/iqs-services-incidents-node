import { CommandSet } from 'pip-services3-commons-node';
import { ICommand } from 'pip-services3-commons-node';
import { Command } from 'pip-services3-commons-node';
import { Schema } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { FilterParamsSchema } from 'pip-services3-commons-node';
import { PagingParamsSchema } from 'pip-services3-commons-node';

import { IncidentV1 } from '../data/version1/IncidentV1';
import { IncidentCountV1 } from '../data/version1/IncidentCountV1';
import { IncidentV1Schema } from '../data/version1/IncidentV1Schema';
import { IIncidentsController } from './IIncidentsController';

export class IncidentsCommandSet extends CommandSet {
    private _logic: IIncidentsController;

    constructor(logic: IIncidentsController) {
        super();

        this._logic = logic;

        // Register commands to the database
		this.addCommand(this.makeGetIncidentsCommand());
		this.addCommand(this.makeGetIncidentsCountCommand());
		this.addCommand(this.makeGetIncidentByIdCommand());
		this.addCommand(this.makeCreateIncidentCommand());
		this.addCommand(this.makeCloseIncidentCommand());
		this.addCommand(this.makeDeleteIncidentByIdCommand());
		this.addCommand(this.makeDeleteExpiredCommand());
    }

	private makeGetIncidentsCommand(): ICommand {
		return new Command(
			"get_incidents",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                let paging = PagingParams.fromValue(args.get("paging"));
                this._logic.getIncidents(correlationId, filter, paging, callback);
            }
		);
	}

	private makeGetIncidentsCountCommand(): ICommand {
		return new Command(
			"get_incidents_count",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                this._logic.getIncidentsCount(correlationId, filter, (err, count) => {
					let result: IncidentCountV1 = err == null ? { count: count } : null;
					callback(err, result);
				});
            }
		);
	}

	private makeGetIncidentByIdCommand(): ICommand {
		return new Command(
			"get_incident_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('incident_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let incident_id = args.getAsString("incident_id");
                this._logic.getIncidentById(correlationId, incident_id, callback);
            }
		);
	}

	private makeCreateIncidentCommand(): ICommand {
		return new Command(
			"create_incident",
			new ObjectSchema(true)
				.withRequiredProperty('incident', new IncidentV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let incident = args.get("incident");
                this._logic.createIncident(correlationId, incident, callback);
            }
		);
	}

	private makeCloseIncidentCommand(): ICommand {
		return new Command(
			"close_incident",
			new ObjectSchema(true)
				.withRequiredProperty('incident_id', TypeCode.String)
				.withRequiredProperty('user', null)
				.withRequiredProperty('resolution_id', TypeCode.String)
				.withRequiredProperty('resolution', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let incidentId = args.getAsNullableString("incident_id");
                let user = args.get("user");
				let resolutionId = args.getAsNullableString("resolution_id");
                let resolution = args.getAsNullableString("resolution");
                this._logic.closeIncident(correlationId, incidentId, user, resolutionId, resolution, callback);
            }
		);
	}
	
	private makeDeleteIncidentByIdCommand(): ICommand {
		return new Command(
			"delete_incident_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('incident_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let incidentId = args.getAsNullableString("incident_id");
                this._logic.deleteIncidentById(correlationId, incidentId, callback);
			}
		);
	}

	private makeDeleteExpiredCommand(): ICommand {
		return new Command(
			"delete_expired",
			new ObjectSchema(true),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                this._logic.deleteExpired(correlationId, (err) => {
					if (callback) callback(err, null);
				});
			}
		);
	}

}