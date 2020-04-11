import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { appImage } from "src/app/utils/interfaces";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";

@Component({
  selector: "app-wildes-heer",
  templateUrl: "./wildes-heer.component.html",
  styleUrls: ["./wildes-heer.component.scss"]
})
export class WildesHeerComponent implements OnInit {
  $images: Observable<appImage[]>;
  $narrengericht: Observable<appImage[]>;

  constructor(imageDAO: ImageDalService) {
    this.$images = imageDAO.getByTags(["Wildes Heer", "Gruppenseite"], 2);
    this.$narrengericht = imageDAO.getByTags(["Narrengericht"], 1);
  }

  ngOnInit(): void {}
}
