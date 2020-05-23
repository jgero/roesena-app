import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Observable, Subscription, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AppEvent } from 'src/app/utils/interfaces';

interface AppEventWithForm extends AppEvent {
  form: FormGroup;
}

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss'],
})
export class MyEventsComponent implements OnInit, OnDestroy {
  $data: Observable<AppEventWithForm[]>;
  displayedColumns: string[] = ['title', 'deadline', 'response'];
  private subs: Subscription[] = [];
  get cols(): number {
    return Math.ceil(window.innerWidth / 550);
  }

  constructor() {}

  ngOnInit() {
    // this.$data = this.eventDAO.getRespondables().pipe(
    //   map((events) => {
    //     return events.map((event) => {
    //       const participant = event.participants.find((p) => p.id === 'asdf');
    //       return {
    //         ...event,
    //         form: new FormGroup({
    //           amount: new FormControl(participant.amount >= 0 ? participant.amount : '', [
    //             Validators.required,
    //             Validators.pattern('^[0-9]*$'),
    //           ]),
    //         }),
    //       };
    //     });
    //   })
    // );
  }

  onSubmit(eventId: string, amount: string, form: FormGroup) {
    // form.disable();
    // this.subs.push(
    //   this.personDAO.respondToEvent(eventId, parseInt(amount, 10)).subscribe({
    //     next: () => {
    //       form.markAsPristine();
    //       form.enable();
    //     },
    //   })
    // );
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
