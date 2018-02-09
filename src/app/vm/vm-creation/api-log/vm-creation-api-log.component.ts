import { Component } from '@angular/core';
import { ApiLogService } from '../../../shared/services/api-log.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'cs-vm-creation-api-log',
  templateUrl: 'vm-creation-api-log.component.html',
  styleUrls: ['vm-creation-api-log.component.scss']
})
export class VmCreationApiLogComponent {

  constructor(
    private apiLogService: ApiLogService,
    private notificationService: NotificationService
  ) {}

  public get apiLog() {
    return this.apiLogService.apiLog;
  }

  public onCopySuccess(): void {
    this.notificationService.message('CLIPBOARD.COPY_SUCCESS');
  }

  public onCopyFail(): void {
    this.notificationService.message('CLIPBOARD.COPY_FAIL');
  }

}
