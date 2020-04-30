import { Observable, of } from "rxjs";
import { Direction } from "readline";
import { appImage } from "src/app/utils/interfaces";

export class ImageDalStub {
  constructor() {}

  getStaticRscURL(): Observable<string | null> {
    return of("http://google.com/test");
  }

  getDownloadURL(): Observable<string | null> {
    return of("http://google.com/test");
  }

  getDocCount(): Observable<number> {
    return of(0);
  }

  getPage(limit: number, d: Direction): Observable<appImage[]> {
    return of([]);
  }

  getById(id: string): Observable<appImage | null> {
    return of(null);
  }

  getBySearchStrings(tags: string[]): Observable<appImage[]> {
    return of([]);
  }
}
