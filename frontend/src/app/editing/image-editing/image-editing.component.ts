import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ImageService } from 'src/app/shared/services/image.service';

@Component({
  selector: 'app-image-editing',
  templateUrl: './image-editing.component.html',
  styleUrls: ['./image-editing.component.scss']
})
export class ImageEditingComponent implements OnInit {

  public images = new BehaviorSubject<{ description: string, tags: string[], _id: string, isEditing: boolean }[]>([]);

  constructor(private http: HttpClient, private imgServ: ImageService) {
    this.loadImages();
  }

  ngOnInit() { }

  private loadImages() {
    this.http.get<{ description: string, tags: string[], _id: string }[]>('/api/image?id=*').subscribe({
      next: data => {
        this.images.next(data.map(value => {
          return ({
            description: value.description,
            tags: value.tags,
            _id: value._id,
            isEditing: false
          });
        }));
      }
    });
  }

  public onSave(data) {
    if (data._id) {
      // update existing image
      this.imgServ.putImage(data).subscribe({
        complete: () => this.loadImages(),
        error: (err) => console.log(err)
      });
    } else {
      // add new image
      this.imgServ.postImage(data).subscribe({
        complete: () => this.loadImages(),
        error: (err) => console.log(err)
      });
    }
  }

  public onEdit(index) {
    const updatedImages = this.images.getValue();
    updatedImages[index].isEditing = true;
    this.images.next(updatedImages);
  }

  public onDelete(id) {
    this.imgServ.deleteImage(id).subscribe({
      complete: () => this.loadImages(),
      error: (err) => console.log(err)
    });
  }
}
