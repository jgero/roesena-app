import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";

import { appEvent } from "../utils/interfaces";
import { AuthService } from "../services/auth.service";
import { convertEventsFromDocuments } from "../utils/eventConverter";

@Injectable({ providedIn: "root" })
export class EventForProfileResolver implements Resolve<appEvent[]> {
  constructor(private firestore: AngularFirestore, private auth: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.auth.getUserFromServer().pipe(
      // request user from db before switching to the event request
      switchMap(user =>
        this.firestore
          .collection<appEvent>("events", qFn => qFn.where(`authLevel`, "<=", user ? user.authLevel : 0))
          .get()
      ),
      // map documents to events
      map(convertEventsFromDocuments),
      // only take the events where the current user is participant
      map(el => el.filter(ev => !!ev.participants.find(participant => participant.id === this.auth.$user.getValue().id)))
    );
  }
}
