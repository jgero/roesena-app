import { ActivatedRoute, Router } from "@angular/router";
import { Component } from "@angular/core";
import { Observable } from "rxjs";

import { AuthService } from "src/app/services/auth.service";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";
import { cardFlyIn } from "src/app/utils/animations";
import { appArticle } from "src/app/utils/interfaces";
import { PaginatedOverview } from "src/app/utils/abstract-overview";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
  animations: [cardFlyIn],
})
export class OverviewComponent extends PaginatedOverview {
  $data: Observable<appArticle[]>;

  constructor(private auth: AuthService, articleDAO: ArticleDalService, route: ActivatedRoute, router: Router) {
    super("articles", articleDAO, route, router);
    super.initDataStream();
  }

  canCreate(): boolean {
    const user = this.auth.$user.getValue();
    // owner and admins can edit
    return user && (user.groups.includes("Autor") || user.groups.includes("admin"));
  }
}
