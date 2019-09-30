import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  // limit the amount of loaded images at some point
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
          tap({ next: images => this.loadedImages = [...this.loadedImages, ...images] }),
          map(images => images[0])
        );
    }
  }

  // add a new image to the database
  public postImage(data: { image: string, description: string, tags: string[] }) {
    return this.http.post('/api/image', data).pipe(
      tap({
        next: (result) => {
          const withId: any = data;
          withId._id = result[0].id;
          this.loadedImages.push(withId);
          console.log(this.loadedImages);
        }
      })
    );
  }

  // update an image
  public putImage(data: { image: string, description: string, tags: string[], _id: string }) {
    // when updating the id has to be deleted before sending the data
    const id = data._id;
    delete data._id;
    return this.http.put(`/api/image?id=${id}`, data).pipe(
      tap({
        next: () => {
          // after sending id can be added again
          data._id = id;
          this.loadedImages[this.loadedImages.findIndex(el => el._id === id)] = data;
        }
      })
    );
  }

  // delete an image
  public deleteImage(id: string) {
    return this.http.delete(`/api/image?id=${id}`).pipe(
      tap({ next: () => this.loadedImages.splice(this.loadedImages.findIndex(el => el._id === id), 1) })
    );
  }

  public getImageIds() {
    return this.http.get<{ description: string, tags: string[], _id: string }[]>(`/api/image?id=*`);
  }
}
