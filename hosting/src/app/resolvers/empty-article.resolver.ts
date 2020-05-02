import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { appArticle } from "../utils/interfaces";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: "root" })
export class EmptyArticleResolver implements Resolve<appArticle> {
  constructor(private auth: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<appArticle> | Promise<appArticle> | appArticle {
    const user = this.auth.$user.getValue();
    return {
      id: "",
      ownerId: user.id,
      ownerName: user.name,
      tags: [],
      title: "",
      content: "",
      created: new Date(),
    };
  }
}
