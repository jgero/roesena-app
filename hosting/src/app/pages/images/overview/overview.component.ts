import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { appImage } from "src/app/utils/interfaces";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent {
  searchString = "";
  $images: Observable<appImage[]>;
  get cols(): number {
    return Math.ceil(window.innerWidth / 500);
  }

  constructor(imageDAO: ImageDalService, public auth: AuthService) {
    this.$images = imageDAO.getImages();
  }

  runSearch() {}
}
