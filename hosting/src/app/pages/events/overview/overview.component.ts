import { Component, OnDestroy } from "@angular/core";
import { Observable } from "rxjs";

import { appEvent } from "src/app/utils/interfaces";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { AuthService } from "src/app/services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SearchableComponent } from "src/app/utils/component-search-extension";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent extends SearchableComponent implements OnDestroy {
  $data: Observable<appEvent[]>;
  get cols(): number {
    return Math.ceil(window.innerWidth / 500);
  }

  constructor(evDAO: EventDALService, public auth: AuthService, route: ActivatedRoute, router: Router) {
    super(evDAO, router, route, "events");
  }

  canCreate(): boolean {
    const user = this.auth.$user.getValue();
    // owner and admins can edit
    return user && (user.groups.includes("Autor") || user.groups.includes("admin"));
  }
}
