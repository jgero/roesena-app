import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";

import { appPerson } from "../utils/interfaces";
import { PersonDalService } from "../services/DAL/person-dal.service";

@Injectable({ providedIn: "root" })
export class PersonsResolver implements Resolve<appPerson[]> {
  constructor(private DAO: PersonDalService, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<appPerson[]> | Promise<appPerson[]> | appPerson[] {
    return this.DAO.getBySearchStrings([], undefined, true).pipe(take(1));
  }
}
