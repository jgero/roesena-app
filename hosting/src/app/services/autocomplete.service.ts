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
          let result = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              result.push({ tag: key, amount: data[key] });
            }
          }
          result = result.sort((a, b) => b.amount - a.amount);
          result = result.map((el) => el.tag);
          return result;
        })
      );
  }
}
