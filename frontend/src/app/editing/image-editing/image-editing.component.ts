import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';

import { Image, ImageMetadata } from 'src/app/interfaces';
import { ImagesGQL } from 'src/app/GraphQL/query-services/all-images-gql.service';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-image-editing',
  templateUrl: './image-editing.component.html',
  styleUrls: ['./image-editing.component.scss']
})
export class ImageEditingComponent implements OnInit {
  public images: Observable<ImageMetadata[]>;
  public editingId: string = undefined;
  private subs: Subscription[] = [];

  constructor(private imagesGql: ImagesGQL) {
    this.loadImages();
  }

  ngOnInit() {}

  private loadImages() {
    this.images = this.imagesGql.watch().valueChanges.pipe(
      map(el => el.data.images),
      catchError(err => {
        // do some popup stuff
        return of([]);
      })
    );
  }

  public onSave(data) {
    if (data._id) {
      // update existing image
    } else {
      // add new image
    }
  }

  public onEdit(id: string) {
    this.editingId = id;
    //   const updatedImages = this.images.getValue();
    //   updatedImages[index].isEditing = true;
    //   this.images.next(updatedImages);
  }

  public onDelete(id) {}
}
