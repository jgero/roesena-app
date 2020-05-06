import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AppPerson } from '../utils/interfaces';
import { PersonDalService } from '../services/DAL/person-dal.service';

@Injectable({ providedIn: 'root' })
export class PersonsResolver implements Resolve<AppPerson[]> {
  constructor(private DAO: PersonDalService, private router: Router) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<AppPerson[]> | Promise<AppPerson[]> | AppPerson[] {
    return this.DAO.getBySearchStrings([], undefined, true).pipe(take(1));
  }
}
