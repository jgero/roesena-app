import { Component, OnInit, Input, HostBinding } from "@angular/core";
import { appImage } from "src/app/utils/interfaces";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { Observable } from "rxjs";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-image-card",
  templateUrl: "./image-card.component.html",
  styleUrls: ["./image-card.component.scss"],
})
export class ImageCardComponent implements OnInit {
  @Input()
  image: appImage;
  $src: Observable<string | null>;

  constructor(private imageDAO: ImageDalService, public auth: AuthService) {}

  ngOnInit(): void {
    this.$src = this.imageDAO.getDownloadURL(this.image.id);
  }

  canEdit(): boolean {
    const user = this.auth.$user.getValue();
    // owner and admins can edit
    return user && (user.id === this.image.ownerId || user.groups.includes("admin"));
  }
}
