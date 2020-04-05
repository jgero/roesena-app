import { Component, Input, HostBinding } from "@angular/core";

import { appArticle } from "src/app/utils/interfaces";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-article-card",
  templateUrl: "./article-card.component.html",
  styleUrls: ["./article-card.component.scss"],
})
export class ArticleCardComponent {
  @Input()
  article: appArticle;

  @HostBinding("class") classes = "card";

  constructor(public auth: AuthService) {}

  canEdit(): boolean {
    return this.auth.$user.getValue() && this.auth.$user.getValue().id === this.article.ownerId;
  }
}
