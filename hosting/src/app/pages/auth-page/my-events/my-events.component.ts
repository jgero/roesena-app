import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AngularFireFunctions } from "@angular/fire/functions";
import { Observable } from "rxjs";

import { appEvent } from "src/app/utils/interfaces";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-my-events",
  templateUrl: "./my-events.component.html",
  styleUrls: ["./my-events.component.scss"]
})
export class MyEventsComponent {
  $events: Observable<appEvent[]>;

  constructor(route: ActivatedRoute, private auth: AuthService, private fns: AngularFireFunctions) {
    this.$events = route.snapshot.data.events;
  }

  respondToEvent(eventId: string, formData: any) {
    // this.loading.incLoading();
    this.fns
      .httpsCallable("respondToEvent")({ id: eventId, amount: parseInt(formData.amount) })
      .subscribe({
        next: () => {
          // this.loading.decLoading();
        },
        error: err => {
          console.log(err);
          // this.loading.decLoading();
        }
      });
  }

  getAmountFromEvent(ev: appEvent): number {
    const amount = ev.participants.find(participant => participant.id === this.auth.$user.getValue().id).amount;
    return amount >= 0 ? amount : null;
  }
}
