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
    return this.auth.getUserFromServer().pipe(
      // request user from db before switching to the event request
      switchMap(user => this.evDAL.getByAuthLevel(user ? user.authLevel : 0)),
      // only take the events where the current user is participant
      map(el => el.filter(ev => !!ev.participants.find(participant => participant.id === this.auth.$user.getValue().id)))
    );
  }
}
