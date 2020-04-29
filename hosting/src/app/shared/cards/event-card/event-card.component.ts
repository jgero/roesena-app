import { Component, Input } from "@angular/core";

import { appEvent } from "../../../utils/interfaces";
import { AuthService } from "src/app/services/auth.service";
import { Card } from "src/app/utils/ui-abstractions";

@Component({
  selector: "app-event-card",
  templateUrl: "./event-card.component.html",
  styleUrls: ["./event-card.component.scss"],
})
export class EventCardComponent extends Card {
  @Input()
  public data: appEvent;

  constructor(auth: AuthService) {
    super(auth);
  }
}
