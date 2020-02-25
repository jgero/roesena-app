import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, of } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { take, map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class LoadUserGuard implements CanActivate {
  constructor(public auth: AngularFireAuth) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // can always activate, just wait for the user to be loaded
    return this.auth.user.pipe(
      take(1),
      map(_ => true),
      catchError(err => of(true))
    );
  }
}
