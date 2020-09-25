import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@state/calendar/reducers/event.reducer';
import { SubscriptionService } from '@services/subscription.service';
import { GoNextMonth, GoPreviousMonth, LoadEvents } from '@state/calendar/actions/event.actions';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnDestroy, OnInit {
  currentDate$ = this.store.select('calendar', 'currentDate');
  days$ = this.store.select('calendar', 'days');
  user$ = this.store.select('user', 'user');
  isLoading$ = this.store.select('calendar', 'isLoading');

  constructor(private store: Store<State>, private subs: SubscriptionService, titleService: Title) {
    titleService.setTitle('RöSeNa - Kalender');
  }

  ngOnInit() {
    this.store.dispatch(new LoadEvents());
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

  navigateToNextMonth() {
    this.store.dispatch(new GoNextMonth());
  }
  navigateToPreviousMonth() {
    this.store.dispatch(new GoPreviousMonth());
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
