import { Component, Input, ElementRef } from "@angular/core";
import { appEvent } from "src/app/utils/interfaces";
import { expandCollapseAnimation } from "src/app/utils/animations";

@Component({
  selector: "app-day",
  animations: [expandCollapseAnimation],
  templateUrl: "./day.component.html",
  styleUrls: ["./day.component.scss"],
})
export class DayComponent {
  @Input()
  day: number;
  @Input()
  events: appEvent[];
  isPopupVisible = false;

  get params(): any {
    if (!this.calendarCardRef.nativeElement || !document.getElementById("calendar")) {
      return {};
    }
    return {
      height: this.calendarCardRef.nativeElement.clientHeight - 12 + "px",
      width: this.calendarCardRef.nativeElement.clientWidth - 12 + "px",
      top:
        (window.pageYOffset || document.documentElement.scrollLeft) +
        this.calendarCardRef.nativeElement.getBoundingClientRect().top +
        "px",
      left:
        (window.pageXOffset || document.documentElement.scrollLeft) +
        this.calendarCardRef.nativeElement.getBoundingClientRect().left +
        "px",
      calendarLeft:
        (window.pageXOffset || document.documentElement.scrollLeft) +
        document.getElementById("calendar").getBoundingClientRect().left +
        "px",
      calendarTop:
        (window.pageXOffset || document.documentElement.scrollLeft) +
        document.getElementById("calendar").getBoundingClientRect().top +
        "px",
      calendarWidth: document.getElementById("calendar").clientWidth + "px",
      calendarHeight: document.getElementById("calendar").clientHeight + "px",
    };
  }

  constructor(private calendarCardRef: ElementRef<HTMLElement>) {}

  onCardClick() {
    if (!this.isPopupVisible) {
      this.isPopupVisible = true;
    }
  }

  onClose(ev: MouseEvent) {
    this.isPopupVisible = false;
    ev.stopPropagation();
  }
}
