import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-image-editing',
  templateUrl: './image-editing.component.html',
  styleUrls: ['./image-editing.component.scss']
})
export class ImageEditingComponent implements OnInit {

  public dbImages = new BehaviorSubject<{ image: string, description: string, tags: string[], _id: string, isEditing: boolean }[]>([]);

  constructor(private http: HttpClient) {
    this.loadImages();
  }

  ngOnInit() { }

  private loadImages() {
    this.http.get<{ image: string, description: string, tags: string[], _id: string }[]>('/api/image?id=*').subscribe({
      next: data => {
        this.dbImages.next(data.map(value => {
          return ({
            image: value.image,
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
      // when updating the id has to be deleted before sending the data
      const id = data._id;
      delete data._id;
      this.http.put(`/api/image?id=${id}`, data).subscribe({
        complete: () => this.loadImages(),
        error: (err) => console.log(err)
      });
    } else {
      this.http.post('/api/image', data).subscribe({
        complete: () => this.loadImages(),
        error: (err) => console.log(err)
      });
    }
  }

  public onEdit(index) {
    const updatedImages = this.dbImages.getValue();
    updatedImages[index].isEditing = true;
    this.dbImages.next(updatedImages);
  }

  public onDelete(id) {
    this.http.delete(`/api/image?id=${id}`).subscribe({
      complete: () => this.loadImages(),
      error: (err) => console.log(err)
    });
  }
}
