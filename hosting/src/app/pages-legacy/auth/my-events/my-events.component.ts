import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";

import { appEvent } from "src/app/utils/interfaces";
import { AuthService } from "src/app/services/auth.service";
import { PersonDalService } from "src/app/services/DAL/person-dal.service";

@Component({
  selector: "app-my-events",
  templateUrl: "./my-events.component.html",
  styleUrls: ["./my-events.component.scss"]
})
export class MyEventsComponent {
  $events: Observable<appEvent[]>;

  constructor(route: ActivatedRoute, public auth: AuthService, private personDAO: PersonDalService) {
    this.$events = route.snapshot.data.events;
  }

  respondToEvent(eventId: string, formData: any) {
    this.personDAO.respondToEvent(eventId, parseInt(formData.amount)).subscribe();
  }

  getAmountFromEvent(userId: string, ev: appEvent): number {
    const amount = ev.participants.find(participant => participant.id === userId).amount;
    return amount >= 0 ? amount : null;
  }
}
