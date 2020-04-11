import { Component, OnInit } from "@angular/core";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { Observable } from "rxjs";
import { appImage } from "src/app/utils/interfaces";
import { map, tap } from "rxjs/operators";

@Component({
  selector: "app-brandjoggala",
  templateUrl: "./brandjoggala.component.html",
  styleUrls: ["./brandjoggala.component.scss"]
})
export class BrandjoggalaComponent implements OnInit {
  $images: Observable<appImage[]>;

  constructor(imageDAO: ImageDalService) {
    this.$images = imageDAO.getByTags(["Brandjoggala", "Gruppenseite"], 2);
  }

  ngOnInit(): void {}
}
