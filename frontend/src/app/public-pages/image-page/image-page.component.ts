import { Component, OnDestroy, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

import { Image } from '../../interfaces';
import { ImagesGQL } from 'src/app/GraphQL/query-services/all-images-gql.service';
import { PopupService } from 'src/app/popup/popup.service';

@Component({
  selector: 'app-image-page',
  templateUrl: './image-page.component.html',
  styleUrls: ['./image-page.component.scss']
})
export class ImagePageComponent {
  public images: Observable<Image[]>;

  constructor(imagesGql: ImagesGQL, private popServ: PopupService, private container: ViewContainerRef) {
    this.images = imagesGql.watch().valueChanges.pipe(
      // map to actual data
      map(result => result.data.images),
      // catch error and return empty article array
      catchError(() => {
        this.popServ.flashPopup('Could not load Persons', this.container);
        return [];
      })
    );
  }

  public nextImg() {
    // navigate to next image
    console.log(this.images);
  }

  public prevImg() {
    // navigate to previous image
  }
}
