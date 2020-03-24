import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { QuerySnapshot, DocumentData, DocumentSnapshot } from "@angular/fire/firestore/interfaces";
import { Observable, of } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";
import "firebase/firestore";
import "firebase/storage";

import { TracingStateService } from "../tracing-state.service";
import { appImage } from "src/app/utils/interfaces";

@Injectable({
  providedIn: "root"
})
export class ImageDalService {
  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage, private trace: TracingStateService) {}

  getImages(): Observable<appImage[]> {
    this.trace.addLoading();
    return this.firestore
      .collection<appImage>("images")
      .get()
      .pipe(
        map(convertImagesFromDocuments),
        tap(() => {
          this.trace.completeLoading();
        }),
        catchError(err => {
          this.trace.completeLoading();
          this.trace.$snackbarMessage.next(`Bilder konnten nicht geladen werden: ${err}`);
          return of([]);
        })
      );
  }

  getById(id: string): Observable<appImage> {
    this.trace.addLoading();
    return this.firestore
      .collection<appImage>("images")
      .doc(id)
      .get()
      .pipe(
        map(convertImageFromDocument),
        tap(() => {
          this.trace.completeLoading();
        }),
        catchError(err => {
          this.trace.completeLoading();
          this.trace.$snackbarMessage.next(`Bild konnte nicht geladen werden: ${err}`);
          return of(null);
        })
      );
  }

  getDownloadURL(bucketUrl: string): Observable<string | null> {
    return this.storage.ref(bucketUrl).getDownloadURL();
  }
}

function convertImagesFromDocuments(snapshot: QuerySnapshot<DocumentData[]>): appImage[] {
  let data: any[] = snapshot.docs.map(doc => {
    let data: any = doc.data();
    data.id = doc.id;
    return data;
  });
  return data;
}

function convertImageFromDocument(snapshot: DocumentSnapshot<DocumentData>): appImage {
  let data = snapshot.data();
  data.id = snapshot.id;
  return data as appImage;
}
