import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";

import { ArticleDalService } from "src/app/services/DAL/article-dal.service";
import { AuthService } from "src/app/services/auth.service";
import { appArticle, appImage, appElement } from "src/app/utils/interfaces";
import { Details } from "src/app/utils/ui-abstractions";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { map } from "rxjs/operators";

@Component({
  selector: "app-detail",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class DetailsComponent {
  article: appArticle;
  $image: Observable<appImage>;

  constructor(imageDAO: ImageDalService, private auth: AuthService, route: ActivatedRoute) {
    this.article = route.snapshot.data.article;
    this.$image = imageDAO.getBySearchStrings(this.article.tags, 1).pipe(map((imgs) => imgs[0]));
  }

  getLinkToImages(val: appArticle): string {
    return `/images/overview/${val.tags.join(",")}`;
  }

  canEdit(appEl: appElement): boolean {
    const user = this.auth.$user.getValue();
    return user && (user.id === appEl.ownerId || user.groups.includes("admin"));
  }
}
