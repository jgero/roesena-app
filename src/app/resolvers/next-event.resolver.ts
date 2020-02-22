import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";

import { appEvent } from "../utils/interfaces";
import { AuthService } from "../services/auth.service";
import { convertEventsFromDocuments } from "../utils/eventConverter";

@Injectable({ providedIn: "root" })
export class NextEventResolver implements Resolve<appEvent> {
  constructor(private firestore: AngularFirestore, private auth: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<appEvent> | Promise<appEvent> | appEvent {
    return this.firestore
      .collection<appEvent>("events", qFn =>
        qFn.where(`authLevel`, "<=", this.auth.$user.getValue() ? this.auth.$user.getValue().authLevel : 0)
      )
      .get()
      .pipe(
        // map documents to events
        map(convertEventsFromDocuments),
        // sort the events
        map(el => el.sort((a, b) => b.endDate.getTime() - a.endDate.getTime())),
        // filter out all the ones that are already over
        map(el => el.filter(val => new Date().getTime() - val.endDate.getTime() > 0)),
        // take the first one of the sorted ones
        map(el => el[0])
      );
  }
}
