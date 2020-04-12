import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";

import { appEvent, appPerson } from "src/app/utils/interfaces";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { PersonDalService } from "src/app/services/DAL/person-dal.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class DetailsComponent {
  $data: Observable<appEvent>;
  $persons: Observable<appPerson>;

  constructor(
    public personDAO: PersonDalService,
    eventDAO: EventDALService,
    route: ActivatedRoute,
    public auth: AuthService,
    public router: Router
  ) {
    this.$data = eventDAO.getById(route.snapshot.paramMap.get("id"));
  }

  onParticipantClick(id: string) {
    if (id === this.auth.$user.getValue().id) {
      this.router.navigate(["/auth/my-events"]);
    }
  }

  getAmountAccumulated(event: appEvent): number {
    let amount = 0;
    event.participants.forEach((part) => {
      if (part.amount < 0) return;
      amount += part.amount;
    });
    return amount;
  }

  getPendingPercent(event: appEvent): number {
    let pending = 0;
    event.participants.forEach((part) => {
      if (part.amount >= 0) return;
      pending++;
    });
    return Math.floor((pending / event.participants.length) * 100);
  }

  getPendingAmount(event: appEvent): number {
    let counter = 0;
    event.participants.forEach((part) => {
      if (part.amount >= 0) return;
      counter++;
    });
    return counter;
  }
}
