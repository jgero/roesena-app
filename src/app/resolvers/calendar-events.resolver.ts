import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import "firebase/firestore";

import { appEvent } from "../interfaces";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: "root" })
export class CalendarEventsResolver implements Resolve<appEvent> {
  constructor(private firestore: AngularFirestore, private auth: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const uid = this.auth.$user.getValue() ? this.auth.$user.getValue().id : undefined;
    const firstDay = route.paramMap.get("id")
      ? new Date(new Date(route.paramMap.get("id")).getFullYear(), new Date(route.paramMap.get("id")).getMonth(), 1)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    if (uid) {
      // if the user is logged in the weird firestore or query has to be done
      return combineLatest(
        this.firestore
          .collection<appEvent>("events", qFn =>
            qFn
              .where(`roles.${uid}`, "in", ["reader", "writer", "owner"])
              // get items where end date is after the first of the month
              .where("endDate", ">=", firstDay)
          )
          .get()
          .pipe(
            map(querySnapshot => {
              // map the data to appEvents
              let data: any[] = querySnapshot.docs.map(doc => {
                let data: any = doc.data();
                data.id = doc.id;
                data.startDate = new Date(data.startDate.toDate());
                data.endDate = new Date(data.endDate.toDate());
                return data;
              });
              // filter out the events that start after the month
              data = data.filter(el =>
                !route.paramMap.get("id")
                  ? el.startDate <= new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
                  : el.startDate <=
                    new Date(
                      new Date(route.paramMap.get("id")).getFullYear(),
                      new Date(route.paramMap.get("id")).getMonth() + 1,
                      0
                    )
              );
              return data;
            })
          ),
        this.firestore
          .collection<appEvent>("events", qFn =>
            qFn
              .where(`roles.isPublic`, "==", true)
              // get items where end date is after the first of the month
              .where("endDate", ">=", firstDay)
          )
          .get()
          .pipe(
            map(querySnapshot => {
              // map the data to appEvents
              let data: any[] = querySnapshot.docs.map(doc => {
                let data: any = doc.data();
                data.id = doc.id;
                data.startDate = new Date(data.startDate.toDate());
                data.endDate = new Date(data.endDate.toDate());
                return data;
              });
              // filter out the events that start after the month
              data = data.filter(el =>
                !route.paramMap.get("id")
                  ? el.startDate <= new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
                  : el.startDate <=
                    new Date(
                      new Date(route.paramMap.get("id")).getFullYear(),
                      new Date(route.paramMap.get("id")).getMonth() + 1,
                      0
                    )
              );
              return data;
            })
          )
      ).pipe(
        // combine the arrays
        map(events => {
          let [publicEvents, myEvents] = events;
          return [...publicEvents, ...myEvents];
        }),
        // remove duplicates
        map(events => {
          return events.filter((item: appEvent, index) => events.findIndex(el => el.id === item.id) === index);
        })
      );
    } else {
      // if no user is logged in just take the public events
      return this.firestore
        .collection<appEvent>("events", qFn =>
          qFn
            .where(`roles.isPublic`, "==", true)
            // get items where end date is after the first of the month
            .where("endDate", ">=", firstDay)
        )
        .get()
        .pipe(
          map(querySnapshot => {
            // map the data to appEvents
            let data: any[] = querySnapshot.docs.map(doc => {
              let data: any = doc.data();
              data.id = doc.id;
              data.startDate = new Date(data.startDate.toDate());
              data.endDate = new Date(data.endDate.toDate());
              return data;
            });
            // filter out the events that start after the month
            data = data.filter(el =>
              !route.paramMap.get("id")
                ? el.startDate <= new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
                : el.startDate <=
                  new Date(new Date(route.paramMap.get("id")).getFullYear(), new Date(route.paramMap.get("id")).getMonth() + 1, 0)
            );
            return data;
          })
        );
    }
  }
}