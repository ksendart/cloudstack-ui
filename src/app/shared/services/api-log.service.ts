import { Injectable } from '@angular/core';
import { ApiLoggerMessage } from '../components/progress-logger/progress-logger-message/progress-logger-message';
import { Utils } from './utils/utils.service';

//todo
export enum ApiLoggerStage {
  CREATE_AG = 'createAffinityGroup',
  CREATE_SG = 'createSecurityGroup',
  CREATE_INGRESS_RULE = 'authorizeIngressRule',
  CREATE_EGRESS_RULE = 'authorizeEgressRule',
  CREATE_TAGS = 'createTags',
  DEPLOY_VM = 'deployVirtualMachine',
}


@Injectable()
export class ApiLogService {
  private apiLogMessages: Array<ApiLoggerMessage> = [];

  constructor() {}

  public add(message: ApiLoggerMessage): string {
    const id = Utils.getUniqueId();
    message.id = id;
    this.apiLogMessages.push(message);
    return message.id;
  }

  public update(id: string, response: any): void {
    const ind = this.apiLogMessages.findIndex(m => m.id === id);
    Object.assign(this.apiLogMessages[ind], { response });
  }

  public get apiLog(): Array<ApiLoggerMessage> {
    return this.apiLogMessages;
  }

  public resetLog(): void {
    this.apiLogMessages = [];
  }
}
