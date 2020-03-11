import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { map, tap } from "rxjs/operators";
import { LoadingService } from "../shared/services/loading.service";

@Injectable({
  providedIn: "root"
})
export class LoggedInGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, private loading: LoadingService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.loading.incLoading();
    return this.auth.getUserFromServer().pipe(
      tap(() => this.loading.decLoading()),
      map(user => (user ? true : this.router.parseUrl("/auth/login")))
    );
  }
}
