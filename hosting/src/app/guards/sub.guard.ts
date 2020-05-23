import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SubscriptionService } from '@services/subscription.service';

@Injectable({
  providedIn: 'root',
})
export class SubGuard implements CanDeactivate<unknown> {
  constructor(private subs: SubscriptionService) {}
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('deactivate module');
    this.subs.unsubscribeComponent$.next();
    return true;
  }
}
