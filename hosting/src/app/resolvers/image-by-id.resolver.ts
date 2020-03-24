import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { appImage } from "../utils/interfaces";
import { ImageDalService } from "../services/DAL/image-dal.service";

@Injectable({ providedIn: "root" })
export class ImageByIdResolver implements Resolve<appImage> {
  constructor(private imgDAO: ImageDalService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.imgDAO.getById(route.paramMap.get("id"));
  }
}
