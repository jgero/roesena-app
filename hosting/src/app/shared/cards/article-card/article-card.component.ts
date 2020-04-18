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
    const user = this.auth.$user.getValue();
    // owner and admins can edit
    return user && (user.id === this.article.ownerId || user.groups.includes("admin"));
  }
}
