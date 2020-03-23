import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";

import { appEvent } from "../utils/interfaces";
import { AuthService } from "../services/auth.service";
import { EventDALService } from "../services/DAL/event-dal.service";

@Injectable({ providedIn: "root" })
export class CalendarEventsResolver implements Resolve<appEvent> {
  constructor(private evDAL: EventDALService, private auth: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.evDAL.getByAuthLevel(this.auth.$user.getValue() ? this.auth.$user.getValue().authLevel : 0).pipe(
      // filter out all the ones that are after the month
      map(el =>
        el.filter(el =>
          !route.paramMap.get("id")
            ? el.startDate <= new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            : el.startDate <=
              new Date(new Date(route.paramMap.get("id")).getFullYear(), new Date(route.paramMap.get("id")).getMonth() + 1, 0)
        )
      ),
      // filter out all the ones that end before the month
      map(el =>
        el.filter(el =>
          !route.paramMap.get("id")
            ? el.endDate >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            : el.endDate >=
              new Date(new Date(route.paramMap.get("id")).getFullYear(), new Date(route.paramMap.get("id")).getMonth(), 1)
        )
      )
    );
  }
}
