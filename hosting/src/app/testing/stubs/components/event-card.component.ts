import { Component, Input } from "@angular/core";
import { appEvent } from "src/app/utils/interfaces";

@Component({ selector: "app-event-card", template: "" })
export class EventCardStub {
  @Input() event: appEvent;
}
