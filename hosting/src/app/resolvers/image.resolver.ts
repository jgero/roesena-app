import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { tap, take } from "rxjs/operators";

import { appImage } from "../utils/interfaces";
import { ImageDalService } from "../services/DAL/image-dal.service";

@Injectable({ providedIn: "root" })
export class ImageResolver implements Resolve<appImage> {
  constructor(private DAO: ImageDalService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<appImage> | Promise<appImage> | appImage {
    const id = route.paramMap.get("id");
    return this.DAO.getById(id).pipe(
      take(1),
      tap((image) => {
        if (!image) {
          this.router.navigate(["images", "overview"]);
        }
      })
    );
  }
}
