import { of, Observable } from 'rxjs';
import { AppArticle, PaginatedDAL } from 'src/app/utils/interfaces';
import { Direction } from 'src/app/utils/enums';

export class ArticleDalStub implements PaginatedDAL {
  public dataArray: AppArticle[] = [];
  public data: AppArticle = null;
  public length = 0;
  constructor() {}
  getById(id: string): Observable<AppArticle | null> {
    return of(this.data);
  }

  getAll(limit?: number): Observable<AppArticle[]> {
    return of(this.dataArray);
  }

  getDocCount(): Observable<number> {
    return of(this.length);
  }

  getPage(limit: number, d: Direction): Observable<AppArticle[]> {
    return of(this.dataArray);
  }

  getBySearchStrings(tags: string[]): Observable<AppArticle[]> {
    return of(this.dataArray);
  }
}
