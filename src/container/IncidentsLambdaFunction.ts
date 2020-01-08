import { Descriptor } from 'pip-services3-commons-node';
import { CommandableLambdaFunction } from 'pip-services3-aws-node';
import { OperationalEventsClientFactory } from 'iqs-clients-opevents-node';
import { IncidentsServiceFactory } from '../build/IncidentsServiceFactory';

export class IncidentsLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("incidents", "Incidents function");
        this._dependencyResolver.put('controller', new Descriptor('iqs-services-incidents', 'controller', 'default', '*', '*'));
        this._factories.add(new IncidentsServiceFactory());
        this._factories.add(new OperationalEventsClientFactory());
    }
}

export const handler = new IncidentsLambdaFunction().getHandler();