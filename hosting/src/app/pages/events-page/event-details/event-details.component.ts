import { Component, OnInit } from "@angular/core";
import { appEvent } from "src/app/utils/interfaces";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-event-details",
  templateUrl: "./event-details.component.html",
  styleUrls: ["./event-details.component.scss"]
})
export class EventDetailsComponent implements OnInit {
  event: appEvent;

  constructor(route: ActivatedRoute) {
    this.event = route.snapshot.data.appEvent;
  }

  ngOnInit(): void {}
}
