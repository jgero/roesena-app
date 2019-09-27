import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private loadedImages: { image: string, description: string, tags: string[], _id: string }[] = [];

  constructor(private http: HttpClient) { }

  // gets image with a specific id, wildcard id "*" is not supported here
  public getImage(id: string): Observable<{ image: string, description: string, tags: string[], _id: string }> {
    if (id === '*') {
      return undefined;
    }
    const existing = this.loadedImages.find(el => id === el._id);
    if (existing) {
      // return cached one
      return of(existing);
    } else {
      // request image from db
      return this.http.get<{ image: string, description: string, tags: string[], _id: string }[]>(`/api/image?id=${id}`)
        .pipe(
          tap(images => this.loadedImages = [...this.loadedImages, ...images]),
          map(images => images[0])
        );
    }
  }
}
