import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { appArticle } from "../utils/interfaces";
import { ArticleDalService } from "../services/DAL/article-dal.service";

@Injectable({ providedIn: "root" })
export class ArticleByIdResolver implements Resolve<appArticle> {
  constructor(private articleDAO: ArticleDalService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.articleDAO.getArticleById(route.paramMap.get("id"));
  }
}
