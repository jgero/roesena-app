import { appEvent } from "src/app/utils/interfaces";
import { of, Observable } from "rxjs";

export class EventDalStub {
  public dataArray: appEvent[] = [];
  public data: appEvent | null;
  constructor() {}

  getRespondables(): Observable<appEvent[]> {
    return of(this.dataArray);
  }

  getAll(limit?: number): Observable<appEvent[]> {
    return of(this.dataArray);
  }

  getForMonth(): Observable<appEvent[]> {
    return of(this.dataArray);
  }

  getById(id: string): Observable<appEvent | null> {
    return of(this.data);
  }
}
