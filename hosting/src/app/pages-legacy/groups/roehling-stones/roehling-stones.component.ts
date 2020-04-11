import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { appImage } from "src/app/utils/interfaces";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";

@Component({
  selector: "app-roehling-stones",
  templateUrl: "./roehling-stones.component.html",
  styleUrls: ["./roehling-stones.component.scss"]
})
export class RoehlingStonesComponent implements OnInit {
  $images: Observable<appImage[]>;

  constructor(imageDAO: ImageDalService) {
    this.$images = imageDAO.getByTags(["Röhling Stones"], 1);
  }

  ngOnInit(): void {}
}
