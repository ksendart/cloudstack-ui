import { SecurityGroup } from '../../../security-group/sg.model';
import { AffinityGroup } from '../../../shared/models/affinity-group.model';

export interface VmCreationApiLog {
  securityGroup: SecurityGroup,
  affinityGroup: AffinityGroup
}
