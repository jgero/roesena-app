import { Component, Input } from "@angular/core";

import { appArticle } from "src/app/utils/interfaces";
import { AuthService } from "src/app/services/auth.service";
import { Card } from "src/app/utils/ui-abstractions";

@Component({
  selector: "app-article-card",
  templateUrl: "./article-card.component.html",
  styleUrls: ["./article-card.component.scss"],
})
export class ArticleCardComponent extends Card {
  @Input()
  data: appArticle;

  constructor(auth: AuthService) {
    super(auth);
  }
}
