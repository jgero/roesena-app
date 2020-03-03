import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";

import { appEvent } from "../utils/interfaces";
import { AuthService } from "../services/auth.service";
import { convertEventsFromDocuments } from "../utils/eventConverter";

@Injectable({ providedIn: "root" })
export class NextEventResolver implements Resolve<appEvent> {
  constructor(private firestore: AngularFirestore, private auth: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<appEvent> | Promise<appEvent> | appEvent {
    return this.auth.getUserFromServer().pipe(
      // request user from db before switching to the event request
      switchMap(user =>
        this.firestore
          .collection<appEvent>("events", qFn => qFn.where(`authLevel`, "<=", user ? user.authLevel : 0))
          .get()
      ),
      // map documents to events
      map(convertEventsFromDocuments),
      // sort the events
      map(el => el.sort((a, b) => b.endDate.getTime() - a.endDate.getTime())),
      // filter out all the ones that are already over
      map(el => el.filter(val => new Date().getTime() - val.endDate.getTime() < 0)),
      // take the last one of the sorted array to get the next event
      map(el => el[el.length - 1])
    );
  }
}
