import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { Image } from 'src/app/interfaces';

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
    if (data._id) {
      // update existing image
      const updateImageMutation = gql`
        mutation UpdateImage {
          updateImage(_id: "${data._id}", description: "${data.description}", image: "${data.image}", tags: ${JSON.stringify(data.tags)}) {
              _id
              description
              tags
              image
          }
        }
      `;
      this.subs.push(this.apollo.mutate<{ updateImage: Image }>({
        mutation: updateImageMutation
      }).subscribe({
        next: result => {
          const { _id, description, tags } = { ...result.data.updateImage };
          this.images.next([...this.images.getValue(), { _id, description, tags, isEditing: false }]);
        }
      }));
    } else {
      // add new image
      const newImageMutation = gql`
        mutation NewImage {
          newImage(description: "${data.description}", image: "${data.image}", tags: ${JSON.stringify(data.tags)}) {
              _id
              description
              tags
              image
          }
        }
      `;
      this.subs.push(this.apollo.mutate<{ newImage: Image }>({
        mutation: newImageMutation
      }).subscribe({
        next: result => console.log(result.data.newImage)
      }));
    }
  }

  public onEdit(index) {
    const updatedImages = this.images.getValue();
    updatedImages[index].isEditing = true;
    this.images.next(updatedImages);
  }

  public onDelete(id) {
    const deleteImageMutation = gql`
        mutation DeleteImage {
          deleteImage(_id: "${id}")
        }
      `;
    this.subs.push(this.apollo.mutate<{ deleteImage: boolean }>({
      mutation: deleteImageMutation
    }).subscribe({
      next: result => {
        if (result.data.deleteImage) {
          // deleting worked, remove image from view
          this.images.next(this.images.getValue().filter(el => el._id !== id));
        } else {
          // error, display some kind of message
          console.log(result.errors);
        }
      }
    }));
  }
}
