import { Component, HostBinding } from "@angular/core";
import { appEvent } from "src/app/utils/interfaces";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-event-details",
  templateUrl: "./event-details.component.html",
  styleUrls: ["./event-details.component.scss"],
})
export class EventDetailsComponent {
  @HostBinding("class") get classes(): string {
    return this.event.participants.length > 0 ? "" : "public";
  }
  event: appEvent;

  constructor(route: ActivatedRoute, public auth: AuthService) {
    this.event = route.snapshot.data.appEvent;
  }

  get amountAccumulated(): number {
    let amount = 0;
    this.event.participants.forEach((part) => {
      if (part.amount < 0) return;
      amount += part.amount;
    });
    return amount;
  }

  get respondedPercent(): number {
    let responded = 0;
    this.event.participants.forEach((part) => {
      if (part.amount < 0) return;
      responded++;
    });
    return Math.floor((responded / this.event.participants.length) * 100);
  }

  get respondedAmount(): number {
    let counter = 0;
    this.event.participants.forEach((part) => {
      if (part.amount < 0) return;
      counter++;
    });
    return counter;
  }
}
