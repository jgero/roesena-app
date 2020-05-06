import { AppEvent } from 'src/app/utils/interfaces';
import { of, Observable } from 'rxjs';

export class EventDalStub {
  public dataArray: AppEvent[] = [];
  public data: AppEvent | null;
  constructor() {}

  getRespondables(): Observable<AppEvent[]> {
    return of(this.dataArray);
  }

  getAll(limit?: number): Observable<AppEvent[]> {
    return of(this.dataArray);
  }

  getForMonth(): Observable<AppEvent[]> {
    return of(this.dataArray);
  }

  getById(id: string): Observable<AppEvent | null> {
    return of(this.data);
  }
}
