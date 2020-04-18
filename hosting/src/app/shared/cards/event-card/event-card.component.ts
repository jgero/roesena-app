import { Component, Input } from "@angular/core";

import { appEvent } from "../../../utils/interfaces";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-event-card",
  templateUrl: "./event-card.component.html",
  styleUrls: ["./event-card.component.scss"],
})
export class EventCardComponent {
  @Input()
  public event: appEvent;

  constructor(public auth: AuthService) {}

  canEdit(): boolean {
    const user = this.auth.$user.getValue();
    // owner and admins can edit
    return user && (user.id === this.event.ownerId || user.groups.includes("admin"));
  }
}
