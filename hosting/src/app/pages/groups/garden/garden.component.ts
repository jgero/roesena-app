import { Component } from "@angular/core";
import { GardeTabData } from "./data";

@Component({
  selector: "app-garden",
  templateUrl: "./garden.component.html",
  styleUrls: ["./garden.component.scss"],
})
export class GardenComponent {
  public readonly data = GardeTabData;

  constructor() {}
}
