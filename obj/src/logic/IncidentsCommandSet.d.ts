import { CommandSet } from 'pip-services3-commons-node';
import { IIncidentsController } from './IIncidentsController';
export declare class IncidentsCommandSet extends CommandSet {
    private _logic;
    constructor(logic: IIncidentsController);
    private makeGetIncidentsCommand;
    private makeGetIncidentsCountCommand;
    private makeGetIncidentByIdCommand;
    private makeCreateIncidentCommand;
    private makeCloseIncidentCommand;
    private makeDeleteIncidentByIdCommand;
    private makeDeleteExpiredCommand;
}
