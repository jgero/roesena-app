import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@state/events/overview/reducers/event.reducer';
import { SubscriptionService } from '@services/subscription.service';
import { LoadEvents } from '@state/events/overview/actions/event.actions';
import { canCreate } from '@state/user/selectors/user.selectors';
import { cardFlyIn } from '@utils/animations/card-fly-in';
import { Title } from '@angular/platform-browser';

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
    return Math.round(this.hostRef.nativeElement.clientWidth / 420);
  }

  constructor(
    private store: Store<State>,
    private subs: SubscriptionService,
    private hostRef: ElementRef<HTMLElement>,
    titleService: Title
  ) {
    titleService.setTitle('RöSeNa - Events');
  }

  ngOnInit() {
    this.store.dispatch(new LoadEvents());
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
