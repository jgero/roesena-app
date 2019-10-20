import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

import { ImageMetadata } from '../interfaces';

@Component({
  selector: 'app-image-page',
  templateUrl: './image-page.component.html',
  styleUrls: ['./image-page.component.scss']
})
export class ImagePageComponent implements OnDestroy {

  public images: ImageMetadata[];
  public activeImage = new BehaviorSubject<number>(0);
  public activeId: Observable<string>;
  private subs: Subscription[] = [];

  constructor(private apollo: Apollo) {
    this.subs.push(this.apollo.watchQuery<{ images: ImageMetadata[] }>({
      query: gql`
      query GetImages {
        images {
          _id
          description
          tags
        }
      }`
    }).valueChanges.subscribe({
      next: result => this.images = result.data.images,
      error: err => console.log(err)
    }));
    this.activeId = this.activeImage.pipe(
      map(
        index => this.images[index]._id
      )
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  public nextImg() {
    if (this.activeImage.getValue() === (this.images.length - 1)) {
      this.activeImage.next(0);
    } else {
      this.activeImage.next(this.activeImage.getValue() + 1);
    }
  }

  public prevImg() {
    if (this.activeImage.getValue() === 0) {
      this.activeImage.next(this.images.length - 1);
    } else {
      this.activeImage.next(this.activeImage.getValue() - 1);
    }
  }
}
