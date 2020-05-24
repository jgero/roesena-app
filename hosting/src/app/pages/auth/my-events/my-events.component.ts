import { Component, OnDestroy, OnInit, ElementRef } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Observable, Subscription, of } from 'rxjs';
import { map, tap, withLatestFrom, take, takeUntil } from 'rxjs/operators';

import { AppEvent } from 'src/app/utils/interfaces';
import { Store } from '@ngrx/store';
import { State } from '@state/auth/my-events/reducers/events.reducer';
import { SubscriptionService } from '@services/subscription.service';
import { LoadEvents, EventsActions, RespondToEvent, EventsActionTypes } from '@state/auth/my-events/actions/events.actions';
import { Actions, ofType } from '@ngrx/effects';

interface AppEventWithForm extends AppEvent {
  form: FormGroup;
}

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss'],
})
export class MyEventsComponent implements OnInit, OnDestroy {
  data$: Observable<AppEventWithForm[]> = this.store.select('myEvents', 'events').pipe(
    withLatestFrom(this.store),
    map(([events, storeState]) => {
      return events.map((event) => {
        const participant = event.participants.find((p) => p.id === storeState.user.user.id);
        return {
          ...event,
          form: new FormGroup({
            amount: new FormControl(participant.amount >= 0 ? participant.amount : '', [
              Validators.required,
              Validators.pattern('^[0-9]*$'),
            ]),
          }),
        };
      });
    })
  );
  get cols(): number {
    return Math.ceil(this.hostRef.nativeElement.clientWidth / 550);
  }

  constructor(
    private store: Store<State>,
    private actions$: Actions<EventsActions>,
    private subs: SubscriptionService,
    private hostRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit() {
    this.store.dispatch(new LoadEvents());
  }

  onSubmit(eventId: string, amount: string, form: FormGroup) {
    form.disable();
    this.store.dispatch(new RespondToEvent({ amount: parseInt(amount), id: eventId }));
    this.actions$
      .pipe(
        ofType(EventsActionTypes.RespondToEventSuccess, EventsActionTypes.RespondToEventFailure),
        take(1),
        takeUntil(this.subs.unsubscribe$)
      )
      .subscribe({
        next: () => {
          form.markAsPristine();
          form.enable();
        },
      });
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
