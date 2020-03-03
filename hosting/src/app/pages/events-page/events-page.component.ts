import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";
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
  public events: Observable<appEvent[]>;

  constructor(firestore: AngularFirestore, private router: Router, auth: AuthService) {
    this.events = auth.getUserFromServer().pipe(
      switchMap(user =>
        firestore
          .collection<appEvent>("events", qFn => qFn.where(`authLevel`, "<=", user ? user.authLevel : 0))
          .snapshotChanges()
      ),
      map(convertEventFromChangeActions)
    );
  }

  ngOnInit(): void {}

  public editEvent(ev: appEvent): void {
    this.router.navigate(["events", "edit", ev.id]);
  }
}
