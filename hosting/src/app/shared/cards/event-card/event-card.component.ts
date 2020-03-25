import { Component, Input, HostBinding } from "@angular/core";

import { appEvent } from "../../../utils/interfaces";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-event-card",
  templateUrl: "./event-card.component.html",
  styleUrls: ["./event-card.component.scss"]
})
export class EventCardComponent {
  @HostBinding("class") classes = "card";
  @Input()
  public event: appEvent;

  constructor(public auth: AuthService) {}
}
