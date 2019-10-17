import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-image-editing',
  templateUrl: './image-editing.component.html',
  styleUrls: ['./image-editing.component.scss']
})
export class ImageEditingComponent implements OnInit {

  public images = new BehaviorSubject<{ description: string, tags: string[], _id: string, isEditing: boolean }[]>([]);
  private subs: Subscription[] = [];

  constructor(private apollo: Apollo) {
    this.loadImages();
  }

  ngOnInit() { }

  private loadImages() {
    this.subs.push(this.apollo.watchQuery<{ images: { _id: string, description: string, tags: string[] }[] }>({
      query: gql`
      query GetImages {
        images {
          _id
          description
          tags
        }
      }`
    }).valueChanges.subscribe({
      next: result => this.images.next(
        // destructure returned image and add the isEditing value to it
        result.data.images.map(({ _id, description, tags }) => ({ _id, description, tags, isEditing: false }))
      )
    }));
  }

  public onSave(data) {
    // if (data._id) {
    //   // update existing image
    //   this.imgServ.putImage(data).subscribe({
    //     complete: () => this.loadImages(),
    //     error: (err) => console.log(err)
    //   });
    // } else {
    //   // add new image
    //   this.imgServ.postImage(data).subscribe({
    //     complete: () => this.loadImages(),
    //     error: (err) => console.log(err)
    //   });
    // }
  }

  public onEdit(index) {
    // const updatedImages = this.images.getValue();
    // updatedImages[index].isEditing = true;
    // this.images.next(updatedImages);
  }

  public onDelete(id) {
    // this.imgServ.deleteImage(id).subscribe({
    //   complete: () => this.loadImages(),
    //   error: (err) => console.log(err)
    // });
  }
}
