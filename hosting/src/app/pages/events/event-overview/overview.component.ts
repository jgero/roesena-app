import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { State } from '@state/events/overview/reducers/event.reducer';
import { SubscriptionService } from '@services/subscription.service';
import { map } from 'rxjs/operators';
import { LoadEvents } from '@state/events/overview/actions/event.actions';
import { canCreate } from '@state/user/selectors/user.selectors';
import { cardFlyIn } from '@utils/animations/card-fly-in';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations: [cardFlyIn],
})
export class OverviewComponent implements OnDestroy, OnInit {
  canCreate$: Observable<boolean> = this.store.select(canCreate);
  data$ = this.store.select('eventOverview', 'events');
  isLoading$ = this.store.select('eventOverview', 'isLoading');
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
