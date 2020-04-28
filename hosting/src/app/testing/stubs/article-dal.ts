import { of, Observable } from "rxjs";
import { appArticle } from "src/app/utils/interfaces";
import { Direction } from "src/app/utils/enums";

export class ArticleDalStub {
  constructor() {}
  getArticleById(id: string): Observable<appArticle | null> {
    return of(null);
  }

  getAll(limit?: number): Observable<appArticle[]> {
    return of([]);
  }

  getDocCount(): Observable<number> {
    return of(0);
  }

  getPage(limit: number, d: Direction): Observable<appArticle[]> {
    return of([]);
  }

  getByTags(tags: string[]): Observable<appArticle[]> {
    return of([]);
  }
}
