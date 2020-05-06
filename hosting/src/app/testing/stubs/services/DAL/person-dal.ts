import { of, Observable } from 'rxjs';
import { AppPerson } from 'src/app/utils/interfaces';
import { Direction } from 'src/app/utils/enums';

export class PersonDalStub {
  constructor() {}

  respondToEvent(): Observable<boolean> {
    return of(true);
  }

  getAll(limit?: number): Observable<AppPerson[]> {
    return of([]);
  }

  getPage(limit: number, d: Direction): Observable<AppPerson[]> {
    return of([]);
  }

  getDocCount(): Observable<number> {
    return of(0);
  }

  update(p: AppPerson): Observable<null> {
    return of(null);
  }
}
