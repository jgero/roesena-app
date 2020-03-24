import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { QuerySnapshot, DocumentData, DocumentSnapshot } from "@angular/fire/firestore/interfaces";
import { Observable, of, from } from "rxjs";
import { tap, catchError, map, switchMap } from "rxjs/operators";
import "firebase/firestore";
import "firebase/storage";

import { TracingStateService } from "../tracing-state.service";
import { appImage } from "src/app/utils/interfaces";
import { AuthService } from "../auth.service";

@Injectable({
  providedIn: "root"
})
export class ImageDalService {
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private trace: TracingStateService,
    private auth: AuthService
  ) {}

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

  getDownloadURL(id: string): Observable<string | null> {
    return this.storage
      .ref("uploads")
      .child(id)
      .getDownloadURL();
  }

  insert(title: string, file: string, tags: string[]): Observable<boolean> {
    this.trace.addLoading();
    return from(this.firestore.collection("images").add({ title, tags, ownerId: this.auth.$user.getValue().id })).pipe(
      switchMap(docRef => this.storage.ref(`uploads/${docRef.id}`).putString(file, "data_url")),
      map(() => true),
      tap(() => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Gespeichert!`);
      }),
      catchError(err => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Bild konnte nicht hinzugefügt werden: ${err}`);
        return of(false);
      })
    );
  }

  update(img: appImage, file: string): Observable<boolean> {
    this.trace.addLoading();
    const id = img.id;
    delete img.id;
    return from(
      this.firestore
        .collection("images")
        .doc(id)
        .update(img)
    ).pipe(
      tap(() => console.log(file)),
      switchMap(() => (file ? this.storage.ref(`uploads/${id}`).putString(file, "data_url") : of(true))),
      map(() => true),
      tap(() => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Gespeichert!`);
      }),
      catchError(err => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Bild konnte nicht bearbeitet werden: ${err}`);
        return of(false);
      })
    );
  }

  delete(id: string): Observable<boolean> {
    this.trace.addLoading();
    return from(
      this.firestore
        .collection("images")
        .doc(id)
        .delete()
    ).pipe(
      map(() => true),
      tap(() => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Gelöscht!`);
      }),
      catchError(err => {
        this.trace.completeLoading();
        this.trace.$snackbarMessage.next(`Bild konnte nicht gelöscht werden: ${err}`);
        return of(false);
      })
    );
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
