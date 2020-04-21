import { Component, OnDestroy } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { Observable, Subscription, of } from "rxjs";
import { map, tap } from "rxjs/operators";

import { appEvent } from "src/app/utils/interfaces";
import { AuthService } from "src/app/services/auth.service";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { PersonDalService } from "src/app/services/DAL/person-dal.service";

interface appEventWithForm extends appEvent {
  form: FormGroup;
}

@Component({
  selector: "app-my-events",
  templateUrl: "./my-events.component.html",
  styleUrls: ["./my-events.component.scss"],
})
export class MyEventsComponent implements OnDestroy {
  $data: Observable<appEventWithForm[]>;
  displayedColumns: string[] = ["title", "deadline", "response"];
  private subs: Subscription[] = [];

  constructor(private eventDAO: EventDALService, private personDAO: PersonDalService, private auth: AuthService) {
    this.$data = this.eventDAO.getRespondables().pipe(
      map((events) => {
        return events.map((event) => {
          const participant = event.participants.find((participant) => participant.id === this.auth.$user.getValue().id);
          return {
            ...event,
            form: new FormGroup({
              amount: new FormControl(participant.amount >= 0 ? participant.amount : "", [
                Validators.required,
                Validators.pattern("^[0-9]*$"),
              ]),
            }),
          };
        });
      })
    );
  }

  onSubmit(eventId: string, amount: string, form: FormGroup) {
    console.log("submitted");
    form.disable();
    this.subs.push(
      this.personDAO.respondToEvent(eventId, parseInt(amount)).subscribe({
        next: () => {
          form.markAsPristine();
          form.enable();
        },
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
