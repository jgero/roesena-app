import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

import 'firebase/storage';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UrlLoaderService {
  constructor(private storage: AngularFireStorage) {}

  getImageURL(id: string): Observable<string | null> {
    return this.storage
      .ref('uploads')
      .child(`${id}_cropped`)
      .getDownloadURL()
      .pipe(
        catchError(() => {
          // image may not be resized yet, function could still be running
          return this.storage
            .ref('uploads')
            .child(id)
            .getDownloadURL()
            .pipe(
              catchError((err) => {
                // image does not exist
                // this.snackbar.open(`Bild URL konnte nicht geladen werden: ${err}`, 'OK');
                return of(null);
              })
            );
        })
      );
  }

  getStaticRscURL(path: string): Observable<string | null> {
    return this.storage
      .ref('static')
      .child(path)
      .getDownloadURL()
      .pipe(
        catchError((err) => {
          // this.snackbar.open(`URL konnte nicht geladen werden: ${err}`, 'OK');
          return of(null);
        })
      );
  }
}
