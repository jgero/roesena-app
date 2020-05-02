import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { tap, take } from "rxjs/operators";

import { appArticle } from "../utils/interfaces";
import { ArticleDalService } from "../services/DAL/article-dal.service";

@Injectable({ providedIn: "root" })
export class ArticleResolver implements Resolve<appArticle> {
  constructor(private DAO: ArticleDalService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<appArticle> | Promise<appArticle> | appArticle {
    const id = route.paramMap.get("id");
    return this.DAO.getById(id).pipe(
      take(1),
      tap((article) => {
        if (!article) {
          this.router.navigate(["articles", "overview"]);
        }
      })
    );
  }
}
