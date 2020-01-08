import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

import { OperationalEventsClientFactory } from 'iqs-clients-opevents-node';

import { IncidentsServiceFactory } from '../build/IncidentsServiceFactory';

export class IncidentsProcess extends ProcessContainer {

    public constructor() {
        super("incidents", "Incidents microservice");
        this._factories.add(new OperationalEventsClientFactory);
        this._factories.add(new IncidentsServiceFactory);
        this._factories.add(new DefaultRpcFactory);
    }

}
