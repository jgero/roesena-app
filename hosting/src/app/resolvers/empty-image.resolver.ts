import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { appImage } from "../utils/interfaces";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: "root" })
export class EmptyImageResolver implements Resolve<appImage> {
  constructor(private auth: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<appImage> | Promise<appImage> | appImage {
    const user = this.auth.$user.getValue();
    return {
      id: "",
      ownerId: user.id,
      ownerName: user.name,
      tags: [],
      created: new Date(),
    };
  }
}
