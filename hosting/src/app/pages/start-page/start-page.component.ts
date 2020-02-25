import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";

import { appEvent } from "../../utils/interfaces";

@Component({
  selector: "app-start-page",
  templateUrl: "./start-page.component.html",
  styleUrls: ["./start-page.component.scss"]
})
export class StartPageComponent {
  public eventForCard: Observable<appEvent>;

  constructor(route: ActivatedRoute) {
    this.eventForCard = route.snapshot.data.appEvent;
  }
}
