import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { appImage } from "src/app/utils/interfaces";
import { Observable } from "rxjs";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-image-details",
  templateUrl: "./image-details.component.html",
  styleUrls: ["./image-details.component.scss"]
})
export class ImageDetailsComponent {
  image: appImage;
  $src: Observable<string | null>;

  constructor(route: ActivatedRoute, imgDAO: ImageDalService, public auth: AuthService) {
    this.image = route.snapshot.data.appImage;
    this.$src = imgDAO.getDownloadURL(this.image.id);
  }
}
