import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs";

import { appImage } from "src/app/utils/interfaces";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { AuthService } from "src/app/services/auth.service";
import { Card } from "src/app/utils/ui-abstractions";

@Component({
  selector: "app-image-card",
  templateUrl: "./image-card.component.html",
  styleUrls: ["./image-card.component.scss"],
})
export class ImageCardComponent extends Card implements OnInit {
  @Input()
  data: appImage;
  $src: Observable<string | null>;

  constructor(private imageDAO: ImageDalService, auth: AuthService) {
    super(auth);
  }

  ngOnInit(): void {
    this.$src = this.imageDAO.getDownloadURL(this.data.id);
  }
}
