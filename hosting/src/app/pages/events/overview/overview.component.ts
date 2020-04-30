import { Component } from "@angular/core";
import { Observable } from "rxjs";

import { appEvent } from "src/app/utils/interfaces";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { AuthService } from "src/app/services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { cardFlyIn } from "src/app/utils/animations";
import { SearchableOverview } from "src/app/utils/ui-abstractions";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
  animations: [cardFlyIn],
})
export class OverviewComponent extends SearchableOverview {
  $data: Observable<appEvent[]>;

  constructor(evDAO: EventDALService, auth: AuthService, route: ActivatedRoute, router: Router) {
    super(["events", "overview"], evDAO, route, router, auth);
  }
}
