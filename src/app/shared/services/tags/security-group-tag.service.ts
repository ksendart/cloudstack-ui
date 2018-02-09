import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SecurityGroup, SecurityGroupType } from '../../../security-group/sg.model';
import { ApiLoggerStage, ApiLogService } from '../api-log.service';
import { EntityTagService } from './entity-tag-service.interface';
import { MarkForRemovalService } from './mark-for-removal.service';
import { SecurityGroupTagKeys } from './security-group-tag-keys';
import { TagService } from './tag.service';

@Injectable()
export class SecurityGroupTagService implements EntityTagService {
  public keys = SecurityGroupTagKeys;

  constructor(
    private markForRemovalService: MarkForRemovalService,
    private apiLogService: ApiLogService,
    protected tagService: TagService
  ) {}

  public markForRemoval(securityGroup: SecurityGroup): Observable<SecurityGroup> {
    return this.markForRemovalService.markForRemoval(securityGroup) as Observable<SecurityGroup>;
  }

  public markAsTemplate(securityGroup: SecurityGroup): Observable<SecurityGroup> {
    return this.tagService.update(
      securityGroup,
      securityGroup.resourceType,
      this.keys.type,
      SecurityGroupType.CustomTemplate
    );
  }

  public markAsPrivate(securityGroup: SecurityGroup): Observable<SecurityGroup> {
    //todo
    const apiMessageId = this.apiLogService.add({
      request: ApiLoggerStage.CREATE_TAGS,
      params: {
        resourceIds: securityGroup.id,
        resourceType: securityGroup.resourceType,
        key: this.keys.type,
        value: SecurityGroupType.Private
      }
    });
    return this.tagService.update(
      securityGroup,
      securityGroup.resourceType,
      this.keys.type,
      SecurityGroupType.Private
    ).do((res) => {
      this.apiLogService.update(apiMessageId, res);
    });
  }

  public convertToShared(securityGroup: SecurityGroup): Observable<SecurityGroup> {
    const newSecurityGroup = Object.assign({}, securityGroup);
    return this.tagService.remove({
      resourceIds: securityGroup.id,
      resourceType: securityGroup.resourceType,
      'tag[0].key': this.keys.type
    })
      .map(() => {
        newSecurityGroup.tags = newSecurityGroup.tags.filter(_ => this.keys.type !== _.key);
        return Object.assign({}, newSecurityGroup, { type: 'shared' }) as SecurityGroup;
      })
  }
}
