import { Component, OnInit, Input } from "@angular/core";
import { appEvent } from "../../../utils/interfaces";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-event-card",
  templateUrl: "./event-card.component.html",
  styleUrls: ["./event-card.component.scss"]
})
export class EventCardComponent implements OnInit {
  @Input()
  public event: appEvent;

  constructor(public auth: AuthService) {}

  ngOnInit(): void {}
}
