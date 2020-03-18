import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, BehaviorSubject, of, Subject } from "rxjs";
import { map, switchMap, tap, catchError } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";

import { appEvent } from "../../utils/interfaces";
import { AuthService } from "../../services/auth.service";
import { convertEventFromChangeActions } from "src/app/utils/eventConverter";

@Component({
  selector: "app-events-page",
  templateUrl: "./events-page.component.html",
  styleUrls: ["./events-page.component.scss"]
})
export class EventsPageComponent implements OnInit {
  $events: Observable<appEvent[]>;
  $isLoading = new BehaviorSubject<boolean>(true);
  $errorMessage = new Subject<string>();

  constructor(firestore: AngularFirestore, private router: Router, auth: AuthService) {
    this.$events = auth.getUserFromServer().pipe(
      switchMap(user =>
        firestore
          .collection<appEvent>("events", qFn => qFn.where(`authLevel`, "<=", user ? user.authLevel : 0))
          .snapshotChanges()
      ),
      tap(() => this.$isLoading.next(false)),
      catchError(err => {
        console.log(err);
        this.$isLoading.next(false);
        this.$errorMessage.next("Fehler bei der Datenübertragung");
        return of([]);
      }),
      map(convertEventFromChangeActions)
    );
  }

  ngOnInit(): void {}

  public editEvent(ev: appEvent): void {
    this.router.navigate(["events", "edit", ev.id]);
  }
}
