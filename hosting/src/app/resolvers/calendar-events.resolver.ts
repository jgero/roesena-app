import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import { appEvent } from "../utils/interfaces";
import { AuthService } from "../services/auth.service";
import { convertEventsFromDocuments } from "../utils/eventConverter";

@Injectable({ providedIn: "root" })
export class CalendarEventsResolver implements Resolve<appEvent> {
  constructor(private firestore: AngularFirestore, private auth: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.firestore
      .collection<appEvent>("events", qFn =>
        qFn.where(`authLevel`, "<=", this.auth.$user.getValue() ? this.auth.$user.getValue().authLevel : 0)
      )
      .get()
      .pipe(
        // map documents to events
        map(convertEventsFromDocuments),
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
