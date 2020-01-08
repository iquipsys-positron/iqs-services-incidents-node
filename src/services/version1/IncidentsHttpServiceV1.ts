import { Descriptor } from 'pip-services3-commons-node';
import { CommandableHttpService } from 'pip-services3-rpc-node';

export class IncidentsHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/incidents');
        this._dependencyResolver.put('controller', new Descriptor('iqs-services-incidents', 'controller', 'default', '*', '1.0'));
    }
}