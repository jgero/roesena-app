import { Component, OnInit } from "@angular/core";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { Observable } from "rxjs";
import { appImage } from "src/app/utils/interfaces";

@Component({
  selector: "app-brandjoggala",
  templateUrl: "./brandjoggala.component.html",
  styleUrls: ["./brandjoggala.component.scss"],
})
export class BrandjoggalaComponent {
  get cols(): number {
    if (window.innerWidth < 750) {
      return 1;
    } else {
      return 2;
    }
  }
  $data: Observable<appImage[]>;

  constructor(imageDAO: ImageDalService) {
    this.$data = imageDAO.getByTags(["Brandjoggala", "Gruppenseite"], 2);
  }
}
