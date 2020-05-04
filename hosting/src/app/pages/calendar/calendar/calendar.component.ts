import { Component, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { map, tap, switchMap } from "rxjs/operators";

import { appEvent } from "src/app/utils/interfaces";
import { EventDALService } from "src/app/services/DAL/event-dal.service";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent implements OnDestroy {
  $activeMonth: Observable<{ date: Date; days: appEvent[][] }>;
  loading: boolean;
  private subs: Subscription[] = [];

  constructor(route: ActivatedRoute, eventDAO: EventDALService, cdr: ChangeDetectorRef) {
    let currentDate: Date;
    this.$activeMonth = route.paramMap.pipe(
      // set loading state and detect changes
      tap(() => {
        this.loading = true;
        cdr.detectChanges();
      }),
      // convert paramMap to date
      map((map) => new Date(map.get("date"))),
      // convert it to the first day of the month
      map((date) => new Date(date.getFullYear(), date.getMonth(), 1)),
      // save the date for later user
      tap((date) => (currentDate = date)),
      // request some events starting from that specific date
      switchMap((date) => eventDAO.getForMonth(date.getFullYear(), date.getMonth())),
      // distribute the events into the day 2D-Array
      map((events) => {
        // empty array with the length of the current month
        let value: appEvent[][] = new Array(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()).fill(
          []
        );
        return value.map((_, index) => {
          let eventsForDay: appEvent[] = [];
          const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), index + 1, 0, 0).getTime();
          const endDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), index + 1, 24, 0).getTime();
          events.forEach((event) => {
            if (event.startDate.getTime() <= endDay && event.endDate.getTime() >= startDay) {
              eventsForDay.push(event);
            }
          });
          return eventsForDay;
        });
      }),
      map((days) => ({ date: currentDate, days })),
      // set loading state and detect changes
      tap(() => {
        this.loading = false;
        cdr.detectChanges();
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  getOffsetArray(d: Date): any[] {
    // get day assumes sunday is first day of the week
    let offset = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
    // shift monday to first position
    offset = offset === 0 ? 6 : offset - 1;
    // return empty array in that length so ngFor can iterate over it
    return new Array(offset).fill(null);
  }

  getNextMonth(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth() + 1);
  }
  getPreviousMonth(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth() - 1);
  }

  getTitle(d: Date): string {
    let val = "";
    switch (d.getMonth()) {
      case 0:
        val += "Januar";
        break;
      case 1:
        val += "Februar";
        break;
      case 2:
        val += "März";
        break;
      case 3:
        val += "April";
        break;
      case 4:
        val += "Mai";
        break;
      case 5:
        val += "Juni";
        break;
      case 6:
        val += "Juli";
        break;
      case 7:
        val += "August";
        break;
      case 8:
        val += "September";
        break;
      case 9:
        val += "Oktober";
        break;
      case 10:
        val += "November";
        break;
      case 11:
        val += "Dezember";
        break;
    }
    val += " " + d.getFullYear();
    return val;
  }
}
