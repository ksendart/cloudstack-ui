import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { Account } from '../models/account.model';
import { AsyncJobService } from './async-job.service';
import { BaseBackendService } from './base-backend.service';

@Injectable()
@BackendResource({
  entity: 'Account'
})
export class AccountService extends BaseBackendService<Account> {

  constructor(
    protected http: HttpClient,
    private asyncJobService: AsyncJobService
  ) {
    super(http);
  }

  public getAccount(params: {}): Observable<Account> {
    return this.getList(params).map(accounts => accounts[0]);
  }

  public removeAccount(account: Account): Observable<Account> {
    return this.sendCommand('delete', { id: account.id })
      .switchMap(job => this.asyncJobService.queryJob(job))
      .switchMap(response => Observable.of(account));
  }

  public disableAccount(account: Account): Observable<Account> {
    return this.sendCommand('disable', {
      id: account.id,
      lock: false
    }).switchMap(job => this.asyncJobService.queryJob(job))
      .switchMap(response => Observable.of(response.jobresult.account));
  }

  public lockAccount(account: Account): Observable<Account> {
    return this.sendCommand('disable', {
      id: account.id,
      lock: true
    }).switchMap(job => this.asyncJobService.queryJob(job))
      .switchMap(response => Observable.of(response.jobresult.account));
  }

  public enableAccount(account: Account): Observable<Account> {
    return this.sendCommand('enable', {
      id: account.id
    }).map(res => res.account);
  }
}
