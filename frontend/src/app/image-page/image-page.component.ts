import { Component, OnDestroy } from '@angular/core';
import { ImageService } from '../shared/services/image.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-image-page',
  templateUrl: './image-page.component.html',
  styleUrls: ['./image-page.component.scss']
})
export class ImagePageComponent {

  public images: Image[];
  public activeImage = new BehaviorSubject<number>(0);
  public activeId: Observable<string>;

  constructor(private apollo: Apollo) {
    this.apollo.watchQuery({
      query: gql`
      query GetImages {
        images {
          _id
          description
          tags
        }
      }`
    }).valueChanges.subscribe({
      next: (result: any) => {
        if (!result.errors && result.data) {
          this.images = result.data.images;
        }
      }
    });
    // imageServ.getImageIds().subscribe({
    //   next: (data) => this.images = data
    // });
    this.activeId = this.activeImage.pipe(
      map(
        index => this.images[index]._id
      )
    );
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

interface Image {
  _id: string;
  description: string;
  tags: string[];
}
