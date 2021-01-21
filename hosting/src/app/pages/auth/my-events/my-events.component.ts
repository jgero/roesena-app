import { Component, OnDestroy, OnInit, ElementRef } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, withLatestFrom, take, takeUntil } from 'rxjs/operators';

import { AppEvent } from 'src/app/utils/interfaces';
import { Store } from '@ngrx/store';
import { State } from '@state/auth/my-events/reducers/events.reducer';
import { SubscriptionService } from '@services/subscription.service';
import { LoadEvents, EventsActions, RespondToEvent, EventsActionTypes } from '@state/auth/my-events/actions/events.actions';
import { Actions, ofType } from '@ngrx/effects';
import { SeoService } from '@services/seo.service';

interface AppEventWithForm extends AppEvent {
  form: FormGroup;
  hasUnseenChanges: boolean;
}

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss'],
})
export class MyEventsComponent implements OnInit, OnDestroy {
  data$: Observable<AppEventWithForm[]> = this.store.select('myEvents', 'events').pipe(
    withLatestFrom(this.store.select('user', 'user')),
    map(([events, user]) => {
      return events.map((event) => {
        const participant = event.participants.find((p) => p.id === user.id);
        return {
          ...event,
          hasUnseenChanges: event.participants.find((part) => part.id === user.id).hasUnseenChanges,
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
  displayedColumns = ['title', 'deadline', 'amount', 'open'];

  get cols(): number {
    return Math.ceil(this.hostRef.nativeElement.clientWidth / 550);
  }

  constructor(
    private store: Store<State>,
    private actions$: Actions<EventsActions>,
    private subs: SubscriptionService,
    private hostRef: ElementRef<HTMLElement>,
    seo: SeoService
  ) {
    seo.setTags(
      'Meine Events',
      'Eine Übersicht für Mitglieder für die Events die Rückmeldung erfordern',
      undefined,
      '/auth/my-events'
    );
  }

  ngOnInit() {
    this.store.dispatch(new LoadEvents());
  }

  hasUnseenChanges(ev: AppEvent) {}

  onSubmit(eventId: string, amount: string, form: FormGroup) {
    form.disable();
    this.store.dispatch(new RespondToEvent({ amount: parseInt(amount, 10), id: eventId }));
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
