import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { take, map, catchError } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (next.url.length === 0) {
      return this.auth.getUserFromServer().pipe(map(user => (user ? true : this.router.parseUrl("/auth/login"))));
    } else if (next.url[0].path === "login" || next.url[0].path === "register") {
      return this.auth.getUserFromServer().pipe(map(user => (user ? this.router.parseUrl("/auth") : true)));
    }
  }
}
