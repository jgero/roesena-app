import { Component, OnInit, Input } from "@angular/core";
import { appEvent } from "src/app/utils/interfaces";

@Component({
  selector: "app-day",
  templateUrl: "./day.component.html",
  styleUrls: ["./day.component.scss"],
})
export class DayComponent implements OnInit {
  @Input()
  day: number;
  @Input()
  events: appEvent[];

  constructor() {}

  ngOnInit(): void {}
}
