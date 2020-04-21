import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { appArticle } from "src/app/utils/interfaces";
import { Observable } from "rxjs";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";
import { tap } from "rxjs/operators";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class DetailComponent implements OnInit {
  $article: Observable<appArticle>;

  constructor(route: ActivatedRoute, articleDAO: ArticleDalService, router: Router) {
    this.$article = articleDAO.getArticleById(route.snapshot.paramMap.get("id")).pipe(
      tap((article) => {
        if (!article) {
          router.navigate(["articles", "overview"]);
        }
      })
    );
  }

  ngOnInit(): void {}
}
