import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { appArticle } from "src/app/utils/interfaces";
import { Observable } from "rxjs";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";
import { tap } from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-detail",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class DetailsComponent implements OnInit {
  $article: Observable<appArticle>;

  constructor(route: ActivatedRoute, articleDAO: ArticleDalService, router: Router, public auth: AuthService) {
    this.$article = articleDAO.getArticleById(route.snapshot.paramMap.get("id")).pipe(
      tap((article) => {
        if (!article) {
          router.navigate(["articles", "overview"]);
        }
      })
    );
  }

  canEdit(article: appArticle): boolean {
    const user = this.auth.$user.getValue();
    return user && (user.id === article.ownerId || user.groups.includes("admin"));
  }

  ngOnInit(): void {}
}
