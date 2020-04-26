import { Component } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Observable } from "rxjs";
import { appArticle } from "src/app/utils/interfaces";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SearchableComponent } from "src/app/utils/component-search-extension";
import { cardFlyIn } from "src/app/utils/animations";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
  animations: [cardFlyIn],
})
export class OverviewComponent extends SearchableComponent {
  $data: Observable<appArticle[]>;
  get cols(): number {
    return Math.ceil(window.innerWidth / 500);
  }

  constructor(public auth: AuthService, articleDAO: ArticleDalService, route: ActivatedRoute, router: Router) {
    super(articleDAO, router, route, "articles");
  }

  canCreate(): boolean {
    const user = this.auth.$user.getValue();
    // owner and admins can edit
    return user && (user.groups.includes("Autor") || user.groups.includes("admin"));
  }
}
