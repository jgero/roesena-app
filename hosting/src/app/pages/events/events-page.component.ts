import { Component } from "@angular/core";
import { Observable } from "rxjs";

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
  descending = true;

  constructor(evDAO: EventDALService, auth: AuthService) {
    this.$events = evDAO.getAllEvents();
  }
}
