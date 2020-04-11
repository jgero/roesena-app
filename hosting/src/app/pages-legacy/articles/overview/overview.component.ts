import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { appArticle } from "src/app/utils/interfaces";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"]
})
export class OverviewComponent implements OnInit {
  $articles: Observable<appArticle[]>;

  constructor(articleDAO: ArticleDalService) {
    this.$articles = articleDAO.getArticles();
  }

  ngOnInit(): void {}
}
