import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

import { appEvent } from "../../utils/interfaces";
import { AuthService } from "../../services/auth.service";
import { EventDALService } from "src/app/services/DAL/event-dal.service";

@Component({
  selector: "app-events-page",
  templateUrl: "./events-page.component.html",
  styleUrls: ["./events-page.component.scss"]
})
export class EventsPageComponent {
  $events: Observable<appEvent[]>;

  constructor(evDAO: EventDALService, auth: AuthService) {
    this.$events = auth.getUserFromServer().pipe(switchMap(user => evDAO.getStreamByAuthLevel(user ? user.authLevel : 0)));
  }
}
