import { Component } from "@angular/core";
import { Location } from "@angular/common";

@Component({
  selector: "app-not-found-page",
  templateUrl: "./not-found-page.component.html",
  styleUrls: ["./not-found-page.component.scss"]
})
export class NotFoundPageComponent {
  constructor(private location: Location) {}

  public goBack() {
    this.location.back();
  }
}
