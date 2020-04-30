import { of, Observable } from "rxjs";
import { appPerson } from "src/app/utils/interfaces";
import { Direction } from "src/app/utils/enums";

export class PersonDalStub {
  constructor() {}

  respondToEvent(): Observable<boolean> {
    return of(true);
  }

  getAll(limit?: number): Observable<appPerson[]> {
    return of([]);
  }

  getPage(limit: number, d: Direction): Observable<appPerson[]> {
    return of([]);
  }

  getDocCount(): Observable<number> {
    return of(0);
  }

  update(p: appPerson): Observable<null> {
    return of(null);
  }
}
