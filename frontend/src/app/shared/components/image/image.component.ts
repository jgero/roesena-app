import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

import { Image } from 'src/app/interfaces';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ImageGQL } from 'src/app/GraphQL/query-services/image-gql.service';
import { map, catchError } from 'rxjs/operators';

const FALLBACK = 'assets/svg/RöSeNa.svg';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {
  @Input()
  private image: Image | { _id: string };

  public src: Observable<string>;

  constructor(private imageGql: ImageGQL) {}

  ngOnInit() {
    if (!this.image || !this.image._id) {
      this.src = of(FALLBACK);
    } else {
      this.src = this.imageGql.watch({ _id: this.image._id }).valueChanges.pipe(
        map(el => (el.data.image.data ? el.data.image.data : FALLBACK)),
        catchError(err => {
          console.log(err);
          return of(FALLBACK);
        })
      );
    }
  }
}
