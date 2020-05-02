import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { tap, take } from "rxjs/operators";

import { ImageDalService } from "../services/DAL/image-dal.service";

@Injectable({ providedIn: "root" })
export class UrlResolver implements Resolve<string> {
  constructor(private DAO: ImageDalService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> | Promise<string> | string {
    const id = route.paramMap.get("id");
    if (id) {
      return this.DAO.getDownloadURL(id).pipe(
        take(1),
        tap((url) => {
          if (!url) {
            this.router.navigate(["images", "overview"]);
          }
        })
      );
    } else {
      return "";
    }
  }
}
