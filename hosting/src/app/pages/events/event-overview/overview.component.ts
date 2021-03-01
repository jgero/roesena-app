import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { SubscriptionService } from '@services/subscription.service';
import { LoadAllEvents } from '@state/events';
import { canCreate } from '@state/persons';
import { cardFlyIn } from '@utils/animations/card-fly-in';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations: [cardFlyIn],
})
export class OverviewComponent implements OnDestroy, OnInit {
  canCreate$: Observable<boolean> = this.store.select(canCreate);
  data$ = this.store.select('events', 'activePageEvents');
  isLoading$ = this.store.select('events', 'isLoading');

  get cols(): number {
    return Math.round(this.hostRef.nativeElement.clientWidth / 420);
  }

  constructor(
    private store: Store<State>,
    private subs: SubscriptionService,
    private hostRef: ElementRef<HTMLElement>,
    seo: SeoService
  ) {
    seo.setTags('Events', 'Eine übersicht über die aktuellen Events der RöSeNa', undefined, '/events/overview');
  }

  ngOnInit() {
    this.store.dispatch(new LoadAllEvents());
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
