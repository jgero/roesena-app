import { Component, OnInit } from "@angular/core";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { Observable } from "rxjs";
import { appImage } from "src/app/utils/interfaces";

@Component({
  selector: "app-image-overview",
  templateUrl: "./image-overview.component.html",
  styleUrls: ["./image-overview.component.scss"]
})
export class ImageOverviewComponent implements OnInit {
  $images: Observable<appImage[]>;

  constructor(public imageDAO: ImageDalService) {
    this.$images = imageDAO.getImages();
  }

  ngOnInit(): void {}
}
