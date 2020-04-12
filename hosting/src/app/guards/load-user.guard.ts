import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from "@angular/router";
import { Observable } from "rxjs";
import { map, filter } from "rxjs/operators";

import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class LoadUserGuard implements CanActivateChild {
  constructor(public auth: AuthService, public router: Router) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.$user.pipe(
      filter((el) => el !== undefined),
      map(() => true)
    );
  }
}
