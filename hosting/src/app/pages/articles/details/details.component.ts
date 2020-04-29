import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";

import { ArticleDalService } from "src/app/services/DAL/article-dal.service";
import { AuthService } from "src/app/services/auth.service";
import { appArticle } from "src/app/utils/interfaces";
import { Details } from "src/app/utils/ui-abstractions";

@Component({
  selector: "app-detail",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class DetailsComponent extends Details {
  $data: Observable<appArticle>;

  constructor(route: ActivatedRoute, articleDAO: ArticleDalService, router: Router, auth: AuthService) {
    super("articles", route, router, articleDAO, auth);
  }
}
