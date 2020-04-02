import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";

import { appEvent } from "../utils/interfaces";
import { AuthService } from "../services/auth.service";
import { EventDALService } from "../services/DAL/event-dal.service";

@Injectable({ providedIn: "root" })
export class EventForProfileResolver implements Resolve<appEvent[]> {
  constructor(private evDAL: EventDALService, private auth: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.evDAL.getRespondables();
  }
}
