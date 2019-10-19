import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Event } from '../interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  private subs: Subscription[] = [];

  public weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  public days = [];
  public events = [];
  public set date(v: { year: number, month: number, day: number }) {
    // update the actual date
    this.dateObj = v;
    // define updating day detail array update
    // the "0." day of a month is the last day of the previous month
    // because months are a number between 0 and 11 there is no "-1" needed here
    const updateDays = () => {
      this.days = new Array(new Date(v.year, v.month, 0).getDate())
        .fill(undefined)
        .map((_, ind) => ({
          gridArea: this.sanitizer.bypassSecurityTrustStyle(this.getGridArea(ind)),
          events: this.events.filter(ev => {
            return (
              ev.startDate <=
              this.getDBString({ year: this.date.year, month: this.date.month, day: ind + 1 }) &&
              ev.endDate >=
              this.getDBString({ year: this.date.year, month: this.date.month, day: ind + 1 })
            );
          }).map(ev => ev.title),
          date: ind + 1
        }));
    };
    // string for start-date
    const start = this.getDBString({
      year: this.date.year,
      month: this.date.month,
      day: 1
    });
    // string for end-date
    const end = this.getDBString({
      year: this.date.year,
      month: this.date.month,
      day: new Date(this.date.year, this.date.month - 1, 0).getDate()
    });
    const getEventsQuery = gql`
      query GetEvents {
        events(startDate: ${start}, endDate: ${end}) {
          _id
          title
          description
          startDate
          endDate
          participants
        }
      }
    `;
    this.subs.push(this.apollo.watchQuery<{ events: Event[] }>({
      query: getEventsQuery
    }).valueChanges.subscribe({
      next: result => {
        this.events = result.data.events;
        updateDays();
      },
      error: () => updateDays()
    }));
  }
  public get date() {
    return this.dateObj;
  }
  private dateObj;

  constructor(private sanitizer: DomSanitizer, private apollo: Apollo) {
    this.date = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };
  }

  ngOnInit() { }

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

  private getDBString(date: { year: number, month: number, day: number }): string {
    const m = date.month > 9 ? date.month : '0' + date.month;
    const d = date.day > 9 ? date.day : '0' + date.day;
    return `${date.year}${m}${d}`;
  }
}
