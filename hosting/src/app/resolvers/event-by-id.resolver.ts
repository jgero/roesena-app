import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";

import { appEvent } from "../utils/interfaces";
import { convertEventFromDocument } from "../utils/eventConverter";

@Injectable({ providedIn: "root" })
export class EventByIdResolver implements Resolve<appEvent> {
  constructor(private firestore: AngularFirestore) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.firestore
      .collection("events")
      .doc(route.paramMap.get("id"))
      .get()
      .pipe(map(convertEventFromDocument));
  }
}
