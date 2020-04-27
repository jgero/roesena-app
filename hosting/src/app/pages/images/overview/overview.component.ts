import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { appImage } from "src/app/utils/interfaces";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { AuthService } from "src/app/services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { cardFlyIn } from "src/app/utils/animations";
import { PaginatedOverview } from "src/app/utils/abstract-overview";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
  animations: [cardFlyIn],
})
export class OverviewComponent extends PaginatedOverview {
  $data: Observable<appImage[]>;

  constructor(imageDAO: ImageDalService, private auth: AuthService, route: ActivatedRoute, router: Router) {
    super("images", imageDAO, route, router);
    super.initDataStream();
  }

  canCreate(): boolean {
    const user = this.auth.$user.getValue();
    // owner and admins can edit
    return user && (user.groups.includes("Autor") || user.groups.includes("admin"));
  }
}
