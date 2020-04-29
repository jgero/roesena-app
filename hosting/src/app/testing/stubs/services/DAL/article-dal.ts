import { of, Observable } from "rxjs";
import { appArticle, appElementDAL } from "src/app/utils/interfaces";
import { Direction } from "src/app/utils/enums";

export class ArticleDalStub implements appElementDAL {
  public dataArray: appArticle[] = [];
  public data: appArticle = null;
  constructor() {}
  getById(id: string): Observable<appArticle | null> {
    return of(this.data);
  }

  getAll(limit?: number): Observable<appArticle[]> {
    return of(this.dataArray);
  }

  getDocCount(): Observable<number> {
    return of(0);
  }

  getPage(limit: number, d: Direction): Observable<appArticle[]> {
    return of(this.dataArray);
  }

  getByTags(tags: string[]): Observable<appArticle[]> {
    return of(this.dataArray);
  }
}
