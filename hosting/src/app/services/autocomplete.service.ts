import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'firebase/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  $existingTags: Observable<string[]>;

  constructor(firestore: AngularFirestore) {
    this.$existingTags = firestore
      .collection('meta')
      .doc<{ [key: string]: number }>('tags')
      .snapshotChanges()
      .pipe(
        map((snapshot) => snapshot.payload.data()),
        map((data) => {
          const result: string[] = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              result.push(key);
            }
          }
          return result;
        })
      );
  }
}
