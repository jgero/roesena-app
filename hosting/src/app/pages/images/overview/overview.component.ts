import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { appImage } from "src/app/utils/interfaces";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { AuthService } from "src/app/services/auth.service";
import { SearchableComponent } from "src/app/utils/component-search-extension";
import { ActivatedRoute, Router } from "@angular/router";
import { cardFlyIn } from "src/app/utils/animations";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
  animations: [cardFlyIn],
})
export class OverviewComponent extends SearchableComponent {
  $data: Observable<appImage[]>;
  get cols(): number {
    return Math.ceil(window.innerWidth / 500);
  }

  constructor(imageDAO: ImageDalService, public auth: AuthService, route: ActivatedRoute, router: Router) {
    super(imageDAO, router, route, "images");
  }

  canCreate(): boolean {
    const user = this.auth.$user.getValue();
    // owner and admins can edit
    return user && (user.groups.includes("Autor") || user.groups.includes("admin"));
  }
}
