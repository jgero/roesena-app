import { Component, OnInit, Input, HostBinding } from "@angular/core";
import { appImage } from "src/app/utils/interfaces";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-image-card",
  templateUrl: "./image-card.component.html",
  styleUrls: ["./image-card.component.scss"]
})
export class ImageCardComponent implements OnInit {
  @Input()
  image: appImage;
  $src: Observable<string | null>;
  @HostBinding("class") classes = "card";

  constructor(private imageDAO: ImageDalService) {}

  ngOnInit(): void {
    this.$src = this.imageDAO.getDownloadURL(this.image.url);
  }
}
