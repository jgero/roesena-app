import { Component, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { appEvent } from "../../utils/interfaces";
import { Subscription } from "rxjs";

@Component({
  selector: "app-calendar-page",
  templateUrl: "./calendar-page.component.html",
  styleUrls: ["./calendar-page.component.scss"]
})
export class CalendarPageComponent implements OnDestroy {
  private subs: Subscription[] = [];
  private id: string;
  public weekdayStrings = [
    { area: "mon", text: "Mo" },
    { area: "tue", text: "Di" },
    { area: "wed", text: "Mi" },
    { area: "thu", text: "Do" },
    { area: "fri", text: "Fr" },
    { area: "sat", text: "Sa" },
    { area: "sun", text: "So" }
  ];
  public dayTemplate: dayTemplateElement[] = [];
  private get date(): Date {
    return this.id ? new Date(this.id) : new Date();
  }
  public get year(): number {
    return this.date.getFullYear();
  }
  public get month(): number {
    return this.date.getMonth();
  }
  public get headerString(): string {
    let d = this.id ? new Date(this.id) : new Date();
    return getMonthName(d) + " " + d.getFullYear();
  }
  public get mondayFirstOffset(): number {
    return new Date(this.year, this.month, 1).getDay() ? new Date(this.year, this.month, 1).getDay() - 1 : 6;
  }
  public get nextMonthString(): string {
    if (this.month < 11) {
      return new Date(this.year, this.month + 1, 1).toISOString();
    } else {
      return new Date(this.year + 1, 0, 1).toISOString();
    }
  }
  public get previousMonthString(): string {
    if (this.month > 0) {
      return new Date(this.year, this.month - 1, 1).toISOString();
    } else {
      return new Date(this.year - 1, 11, 1).toISOString();
    }
  }

  constructor(private route: ActivatedRoute) {
    this.subs.push(this.route.paramMap.subscribe(pMap => (this.id = pMap.get("id"))));
    this.subs.push(
      this.route.data.subscribe(data => {
        const dayAmount = new Date(this.year, this.month + 1, 0).getDate();
        const offset = this.mondayFirstOffset;
        this.dayTemplate = new Array(dayAmount).fill(undefined).map(
          (_, index): dayTemplateElement => {
            const column = new Date(this.year, this.month, index).getDay() + 1;
            const row = Math.floor((offset + index) / 7) + 3;
            return {
              date: index + 1,
              events: data.calendarEvents.filter(
                (event: appEvent) =>
                  new Date(event.startDate).getTime() <= new Date(this.year, this.month, index + 1, 23, 59).getTime() &&
                  new Date(event.endDate).getTime() >= new Date(this.year, this.month, index + 1, 0, 0).getTime()
              ),
              gridArea: `${row} / ${column} / ${row} / ${column}`
            };
          }
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}

interface dayTemplateElement {
  gridArea: string;
  date: number;
  events: appEvent[];
}

function getMonthName(d: Date): string {
  switch (d.getMonth()) {
    case 0:
      return "Januar";
    case 1:
      return "Februar";
    case 2:
      return "März";
    case 3:
      return "April";
    case 4:
      return "Mai";
    case 5:
      return "Juni";
    case 6:
      return "Juli";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "Oktober";
    case 10:
      return "November";
    case 11:
      return "Dezember";
  }
}
