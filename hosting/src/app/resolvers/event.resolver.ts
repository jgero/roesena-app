import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { tap, take } from "rxjs/operators";

import { appEvent } from "../utils/interfaces";
import { EventDALService } from "../services/DAL/event-dal.service";

@Injectable({ providedIn: "root" })
export class EventResolver implements Resolve<appEvent> {
  constructor(private DAO: EventDALService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<appEvent> | Promise<appEvent> | appEvent {
    const id = route.paramMap.get("id");
    return this.DAO.getById(id).pipe(
      take(1),
      tap((event) => {
        if (!event) {
          this.router.navigate(["events", "overview"]);
        }
      })
    );
  }
}
