import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { Subscription } from 'rxjs';
import { Event } from 'src/app/interfaces';
import { EventsByDateGQL } from 'src/app/GraphQL/query-services/events/events-by-date-gql.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnDestroy {
  private subs: Subscription[] = [];
  public weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  public daysWithMetadata: { gridArea: SafeStyle; events: Event[]; date: number }[] = [];
  private dateObj: { year: number; month: number; day: number };

  public set date(v: { year: number; month: number; day: number }) {
    // update the raw date object
    this.dateObj = v;
    // load the events for the current month
    this.subs.push(
      this.eventsGQL
        .watch({
          startDate: this.getDBDateNumber({
            year: this.date.year,
            month: this.date.month,
            day: 1
          }),
          endDate: this.getDBDateNumber({
            year: this.date.year,
            month: this.date.month,
            day: new Date(this.date.year, this.date.month - 1, 0).getDate()
          })
        })
        .valueChanges.subscribe({
          next: result => this.mapEventsToDays(result.data.eventsByDate)
        })
    );
  }
  public get date() {
    return this.dateObj;
  }

  constructor(private sanitizer: DomSanitizer, private eventsGQL: EventsByDateGQL) {
    this.date = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };
  }

  private getGridArea(ind) {
    // month is a number between 0 and 11, thus "-1" is needed, because the date.month number is a "normal" month number
    const firstWeekday = new Date(this.date.year, this.date.month - 1, 1).getDay();
    // normally sunday is index 0, like this monday is
    const weekdayWithMondayOffset = firstWeekday > 0 ? firstWeekday - 1 : 6;
    // divide by 7 weekdays and add 3 because of the headings
    const row = Math.floor((weekdayWithMondayOffset + ind) / 7) + 3;
    // don't forget the "-1" for the months!
    const column = new Date(this.date.year, this.date.month - 1, ind).getDay() + 2;
    return `${row} / ${column} / ${row} / ${column}`;
  }

  private mapEventsToDays(events: Event[]) {
    // because months are a number between 0 and 11 in 'new Date' using 'this.dateObj.month' creates a date
    // in the next month, but by then using 0 as day argument a date with the last day of the previous
    // month is created. This means getDate() of this date will be the last day of the current month
    this.daysWithMetadata = new Array(new Date(this.dateObj.year, this.dateObj.month, 0).getDate())
      .fill(undefined)
      .map((_, ind) => ({
        gridArea: this.sanitizer.bypassSecurityTrustStyle(this.getGridArea(ind)),
        events: events.filter(ev => {
          return (
            ev.startDate <= this.getDBDateNumber({ year: this.date.year, month: this.date.month, day: ind + 1 }) &&
            ev.endDate >= this.getDBDateNumber({ year: this.date.year, month: this.date.month, day: ind + 1 })
          );
        }),
        date: ind + 1
      }));
  }

  public goNextMonth() {
    const newDate = this.date;
    if (newDate.month < 12) {
      newDate.month += 1;
    } else {
      newDate.year += 1;
      newDate.month = 1;
    }
    this.date = newDate;
  }

  public goPreviousMonth() {
    const newDate = this.date;
    if (newDate.month > 1) {
      newDate.month -= 1;
    } else {
      newDate.year -= 1;
      newDate.month = 12;
    }
    this.date = newDate;
  }

  private getDBDateNumber({ year, month, day }: { year: number; month: number; day: number }): number {
    const m = month > 9 ? month : '0' + month;
    const d = day > 9 ? day : '0' + day;
    return parseInt(`${year}${m}${d}`, 10);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
