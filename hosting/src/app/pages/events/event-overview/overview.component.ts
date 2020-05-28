import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { cardFlyIn } from 'src/app/utils/animations';
import { Store } from '@ngrx/store';
import { State } from '@state/events/overview/reducers/event.reducer';
import { SubscriptionService } from '@services/subscription.service';
import { map } from 'rxjs/operators';
import { LoadEvents } from '@state/events/overview/actions/event.actions';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations: [cardFlyIn],
})
export class OverviewComponent implements OnDestroy, OnInit {
  canEdit$: Observable<boolean> = this.store.select('user').pipe(map((state) => state.isAuthor || state.isAdmin));
  data$ = this.store.select('eventOverview', 'events');
  get cols(): number {
    return Math.ceil(window.innerWidth / 700);
  }

  constructor(private store: Store<State>, private subs: SubscriptionService) {}

  ngOnInit() {
    this.store.dispatch(new LoadEvents());
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
