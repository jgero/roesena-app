import { Component, OnDestroy } from "@angular/core";
import { Observable } from "rxjs";

import { appEvent } from "src/app/utils/interfaces";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { AuthService } from "src/app/services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { cardFlyIn } from "src/app/utils/animations";
import { SearchableOverview } from "src/app/utils/abstract-overview";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
  animations: [cardFlyIn],
})
export class OverviewComponent extends SearchableOverview implements OnDestroy {
  $data: Observable<appEvent[]>;

  constructor(evDAO: EventDALService, public auth: AuthService, route: ActivatedRoute, router: Router) {
    super("events", evDAO, route, router);
    super.initDataStream();
  }

  canCreate(): boolean {
    const user = this.auth.$user.getValue();
    // owner and admins can edit
    return user && (user.groups.includes("Autor") || user.groups.includes("admin"));
  }
}
