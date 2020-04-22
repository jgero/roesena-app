import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Observable, Subscription } from "rxjs";
import { appArticle } from "src/app/utils/interfaces";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent implements OnDestroy {
  $articles: Observable<appArticle[]>;
  searchString = "";
  private subs: Subscription[] = [];
  get cols(): number {
    return Math.ceil(window.innerWidth / 500);
  }

  constructor(public auth: AuthService, private articleDAO: ArticleDalService, route: ActivatedRoute, private router: Router) {
    const initialSearchString = route.snapshot.paramMap.get("searchString");
    if (initialSearchString) {
      this.searchString = initialSearchString;
      this.runSearch();
    } else {
      this.$articles = articleDAO.getArticles();
    }
    this.subs.push(
      route.paramMap.subscribe((map) => {
        const searchString = map.get("searchString");
        if (searchString) {
          this.searchString = searchString;
          this.runSearch();
        }
      })
    );
  }

  canCreate(): boolean {
    const user = this.auth.$user.getValue();
    // owner and admins can edit
    return user && (user.groups.includes("Autor") || user.groups.includes("admin"));
  }

  private runSearch() {
    const tags = this.searchString.trim().split(" ");
    this.$articles = this.articleDAO.getArticlesByTags(tags);
  }

  onSearchClick() {
    if (this.searchString) {
      this.router.navigate(["articles", "overview", this.searchString]);
    } else {
      this.router.navigate(["articles", "overview"]);
    }
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
