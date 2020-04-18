import { Component } from "@angular/core";
import { Observable } from "rxjs";

import { appEvent } from "src/app/utils/interfaces";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent {
  searchString = "";
  $events: Observable<appEvent[]>;
  get cols(): number {
    return Math.ceil(window.innerWidth / 500);
  }

  constructor(evDAO: EventDALService, public auth: AuthService) {
    this.$events = evDAO.getEvents();
  }

  canCreate(): boolean {
    const user = this.auth.$user.getValue();
    // owner and admins can edit
    return user && (user.groups.includes("Autor") || user.groups.includes("admin"));
  }

  runSearch() {}
}
