import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { SubscriptionService } from '@services/subscription.service';
import { SeoService } from '@services/seo.service';
import { LoadEventsForMonth, EventActions } from '@state/events';
import { Router } from '@angular/router';
import { map, filter, takeUntil } from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnDestroy, OnInit {
  currentDate$ = this.store.select('router', 'state', 'params', 'date').pipe(
    filter((dateString) => dateString !== ''),
    map((dateString) => new Date(dateString))
  );
  days$ = this.store.select('events', 'activeMonth');
  user$ = this.store.select('persons', 'user');
  isLoading$ = this.store.select('events', 'isLoading');

  constructor(
    private store: Store<State>,
    private subs: SubscriptionService,
    seo: SeoService,
    private router: Router,
    private actions$: Actions<EventActions>
  ) {
    seo.setTags('Kalender', 'Kalernder der Events der RöSeNa', undefined, '/calendar');
  }

  ngOnInit() {
    // dispatch loading once manually because oninit happens after ROUTER_NAVIGATED in initial arrival
    this.store.dispatch(new LoadEventsForMonth());
    // component init only happens on first arrival on the calendar route
    // this means when navigating between months action on ROUTER_NAVIGATED is necessary
    this.actions$
      .pipe(
        ofType(ROUTER_NAVIGATED),
        // unsubscribe when component is destroyed
        takeUntil(this.subs.unsubscribe$)
      )
      // load when new route is loaded
      .subscribe(() => this.store.dispatch(new LoadEventsForMonth()));
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }

  getOffsetArray(d: Date): any[] {
    // get day assumes sunday is first day of the week
    let offset = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
    // shift monday to first position
    offset = offset === 0 ? 6 : offset - 1;
    // return empty array in that length so ngFor can iterate over it
    return new Array(offset).fill(null);
  }

  navigateToNextMonth(currentDate: Date) {
    this.router.navigate(['calendar', new Date(currentDate.getFullYear(), currentDate.getMonth() + 1).toISOString()]);
  }
  navigateToPreviousMonth(currentDate: Date) {
    this.router.navigate(['calendar', new Date(currentDate.getFullYear(), currentDate.getMonth() - 1).toISOString()]);
  }

  getTitle(d: Date): string {
    let val = '';
    switch (d.getMonth()) {
      case 0:
        val += 'Januar';
        break;
      case 1:
        val += 'Februar';
        break;
      case 2:
        val += 'März';
        break;
      case 3:
        val += 'April';
        break;
      case 4:
        val += 'Mai';
        break;
      case 5:
        val += 'Juni';
        break;
      case 6:
        val += 'Juli';
        break;
      case 7:
        val += 'August';
        break;
      case 8:
        val += 'September';
        break;
      case 9:
        val += 'Oktober';
        break;
      case 10:
        val += 'November';
        break;
      case 11:
        val += 'Dezember';
        break;
    }
    val += ' ' + d.getFullYear();
    return val;
  }
}
