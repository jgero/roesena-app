import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Observable } from "rxjs";
import { appArticle } from "src/app/utils/interfaces";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent implements OnInit {
  searchString = "";
  $articles: Observable<appArticle[]>;
  get cols(): number {
    return Math.ceil(window.innerWidth / 500);
  }

  constructor(public auth: AuthService, articleDAO: ArticleDalService) {
    this.$articles = articleDAO.getArticles();
  }

  runSearch() {}

  ngOnInit(): void {}
}
