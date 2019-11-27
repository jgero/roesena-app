import { Component, OnDestroy, ViewContainerRef } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';

import { Image, ImageMetadata } from 'src/app/interfaces';
import { ImagesGQL } from 'src/app/GraphQL/query-services/all-images-gql.service';
import { map, catchError } from 'rxjs/operators';
import { UpdateImageGQL } from 'src/app/GraphQL/mutation-services/image/updateImage-gql.service';
import { NewImageGQL } from 'src/app/GraphQL/mutation-services/image/newImage-gql.service';
import { DeleteImageGQL } from 'src/app/GraphQL/mutation-services/image/deleteImage-gql.service';
import { PopupService } from 'src/app/popup/popup.service';
import { GlobalSearchService } from 'src/app/public-pages/main/global-search.service';

@Component({
  selector: 'app-image-editing',
  templateUrl: './image-editing.component.html',
  styleUrls: ['./image-editing.component.scss']
})
export class ImageEditingComponent implements OnDestroy {
  public images: Observable<ImageMetadata[]>;
  public editingId: string = undefined;
  private subs: Subscription[] = [];

  constructor(
    private imagesGql: ImagesGQL,
    private updateImageGql: UpdateImageGQL,
    private newImageGql: NewImageGQL,
    private deleteImageGql: DeleteImageGQL,
    private popServ: PopupService,
    private container: ViewContainerRef,
    public search: GlobalSearchService
  ) {
    this.images = this.imagesGql.watch().valueChanges.pipe(
      map(el => el.data.images),
      catchError(() => {
        this.popServ.flashPopup('could not fetch data!', this.container);
        return of([]);
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(el => el.unsubscribe());
  }

  public onSave(img: Image) {
    const { _id, data, description, tags } = img;
    if (_id) {
      // update existing image
      this.subs.push(
        this.updateImageGql.mutate({ _id, data, description, tags }).subscribe({
          next: () => this.popServ.flashPopup('Bild bearbeitet', this.container),
          error: () => this.popServ.flashPopup('Bearbeiten fehlgeschlagen', this.container),
          complete: () => {
            // refetch the images, will cause the images Observable to emit the new values
            this.imagesGql.watch().refetch();
            // reset editing id
            this.editingId = undefined;
          }
        })
      );
    } else {
      // add new image
      this.subs.push(
        this.newImageGql.mutate({ data, description, tags }).subscribe({
          next: () => this.popServ.flashPopup('Bild hinzugefügt', this.container),
          error: () => this.popServ.flashPopup('Hinzufügen fehlgeschlagen', this.container),
          complete: () => {
            // refetch the images, will cause the images Observable to emit the new values
            this.imagesGql.watch().refetch();
            // reset editing id
            this.editingId = undefined;
          }
        })
      );
    }
  }

  public onDelete(id: string) {
    this.subs.push(
      this.deleteImageGql.mutate({ _id: id }).subscribe({
        next: () => this.popServ.flashPopup('Bild gelöscht', this.container),
        error: err => this.popServ.flashPopup('Löschen fehlgeschlagen', this.container),
        complete: () => {
          // refetch the images, will cause the images Observable to emit the new values
          this.imagesGql.watch().refetch();
          // reset editing id
          this.editingId = undefined;
        }
      })
    );
  }
}
