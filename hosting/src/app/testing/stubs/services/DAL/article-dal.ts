import { of, Observable } from "rxjs";
import { appArticle, paginatedDAL } from "src/app/utils/interfaces";
import { Direction } from "src/app/utils/enums";

export class ArticleDalStub implements paginatedDAL {
  public dataArray: appArticle[] = [];
  public data: appArticle = null;
  public length: number = 0;
  constructor() {}
  getById(id: string): Observable<appArticle | null> {
    return of(this.data);
  }

  getAll(limit?: number): Observable<appArticle[]> {
    return of(this.dataArray);
  }

  getDocCount(): Observable<number> {
    return of(this.length);
  }

  getPage(limit: number, d: Direction): Observable<appArticle[]> {
    return of(this.dataArray);
  }

  getBySearchStrings(tags: string[]): Observable<appArticle[]> {
    return of(this.dataArray);
  }
}
