import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SubscriptionService } from '@services/subscription.service';
import { Store } from '@ngrx/store';
import { State } from '@state/events/reducers/event.reducer';
import { LoadEvent, MarkEventAsSeen } from '@state/events/actions/event.actions';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnDestroy, OnInit {
  canEdit$: Observable<boolean> = this.store.select('user').pipe(map((state) => state.isAuthor || state.isAdmin));
  data$ = this.store.select('events', 'event');
  amountAccumulated$ = this.data$.pipe(
    map((event) => {
      let amount = 0;
      event.participants.forEach((part) => {
        if (part.amount < 0) {
          return;
        }
        amount += part.amount;
      });
      return amount;
    })
  );
  pendingPercent$ = this.data$.pipe(
    map((event) => {
      let pending = 0;
      event.participants.forEach((part) => {
        if (part.amount >= 0) {
          return;
        }
        pending++;
      });
      return Math.floor((pending / event.participants.length) * 100);
    })
  );
  pendingAmount$ = this.data$.pipe(
    map((event) => {
      let counter = 0;
      event.participants.forEach((part) => {
        if (part.amount >= 0) {
          return;
        }
        counter++;
      });
      return counter;
    })
  );

  constructor(private store: Store<State>, private subs: SubscriptionService) {}

  ngOnInit() {
    this.store.dispatch(new LoadEvent());
    this.store.dispatch(new MarkEventAsSeen());
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
