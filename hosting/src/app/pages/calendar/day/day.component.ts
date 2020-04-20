import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { appEvent } from "src/app/utils/interfaces";
import { expandCollapseAnimation } from "./expand-collapse.animation";

@Component({
  selector: "app-day",
  animations: [expandCollapseAnimation],
  templateUrl: "./day.component.html",
  styleUrls: ["./day.component.scss"],
})
export class DayComponent implements OnInit {
  @Input()
  day: number;
  @Input()
  events: appEvent[];
  isPopupVisible = false;

  get calendarLeft(): string {
    return (
      (window.pageXOffset || document.documentElement.scrollLeft) +
      document.getElementById("calendar").getBoundingClientRect().left +
      "px"
    );
  }
  get calendarWidth(): string {
    return document.getElementById("calendar").clientWidth + "px";
  }
  get calendarTop(): string {
    return (
      (window.pageXOffset || document.documentElement.scrollLeft) +
      document.getElementById("calendar").getBoundingClientRect().top +
      "px"
    );
  }
  get calendarHeight(): string {
    return document.getElementById("calendar").clientHeight + "px";
  }

  get left(): string {
    return (
      (window.pageXOffset || document.documentElement.scrollLeft) +
      this.calendarCardRef.nativeElement.getBoundingClientRect().left +
      "px"
    );
  }
  get top(): string {
    return (
      (window.pageYOffset || document.documentElement.scrollLeft) +
      this.calendarCardRef.nativeElement.getBoundingClientRect().top +
      "px"
    );
  }
  get width(): string {
    return this.calendarCardRef.nativeElement.clientWidth - 12 + "px";
  }
  get height(): string {
    return this.calendarCardRef.nativeElement.clientHeight - 12 + "px";
  }

  constructor(private calendarCardRef: ElementRef<HTMLElement>, private cdr: ChangeDetectorRef) {}

  onCardClick() {
    if (!this.isPopupVisible) {
      this.isPopupVisible = true;
    }
  }

  onClose(ev: MouseEvent) {
    this.isPopupVisible = false;
    ev.stopPropagation();
  }

  // onClick() {
  //   const rect = this.calendarCardRef.nativeElement.getBoundingClientRect();
  //   const left = (window.pageXOffset || document.documentElement.scrollLeft) + rect.left;
  //   const top = (window.pageYOffset || document.documentElement.scrollTop) + rect.top;
  //   console.log(left, top);
  // }

  ngOnInit(): void {}
}
