import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

import { appEvent } from "../utils/interfaces";
import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: "root" })
export class EmptyEventResolver implements Resolve<appEvent> {
  constructor(private auth: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<appEvent> | Promise<appEvent> | appEvent {
    const user = this.auth.$user.getValue();
    return {
      id: "",
      ownerId: user.id,
      ownerName: user.name,
      tags: [],
      description: "",
      deadline: null,
      startDate: new Date(),
      endDate: new Date(),
      title: "",
      participants: [],
    };
  }
}
