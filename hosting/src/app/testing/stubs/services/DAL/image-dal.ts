import { Observable, of } from 'rxjs';
import { Direction } from 'readline';
import { AppImage } from 'src/app/utils/interfaces';

export class ImageDalStub {
  constructor() {}

  getStaticRscURL(): Observable<string | null> {
    return of('http://google.com/test');
  }

  getDownloadURL(): Observable<string | null> {
    return of('http://google.com/test');
  }

  getDocCount(): Observable<number> {
    return of(0);
  }

  getPage(limit: number, d: Direction): Observable<AppImage[]> {
    return of([]);
  }

  getById(id: string): Observable<AppImage | null> {
    return of(null);
  }

  getBySearchStrings(tags: string[]): Observable<AppImage[]> {
    return of([]);
  }
}
