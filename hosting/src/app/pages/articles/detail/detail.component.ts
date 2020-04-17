import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { appArticle } from "src/app/utils/interfaces";
import { Observable } from "rxjs";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class DetailComponent implements OnInit {
  $article: Observable<appArticle>;

  constructor(route: ActivatedRoute, articleDAO: ArticleDalService) {
    this.$article = articleDAO.getArticleById(route.snapshot.paramMap.get("id"));
  }

  ngOnInit(): void {}
}
