import { Component, OnDestroy } from '@angular/core';
import { ImageService } from '../shared/services/image.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-image-page',
  templateUrl: './image-page.component.html',
  styleUrls: ['./image-page.component.scss']
})
export class ImagePageComponent {

  public images: { description: string, tags: string[], _id: string }[];
  public activeImage = new BehaviorSubject<number>(0);
  public activeId: Observable<string>;

  constructor(public imageServ: ImageService) {
    imageServ.getImageIds().subscribe({
      next: (data) => this.images = data
    });
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
