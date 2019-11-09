import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Image } from 'src/app/interfaces';

@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.scss']
})
export class EditCardComponent implements OnInit {
  public hash = new Date().toTimeString();

  public imageData: string;
  public description: string;
  public tags = new BehaviorSubject<string[]>([]);
  public _id: string;

  public tagInput: string;

  public get image(): Image {
    return {
      data: this.imageData,
      description: this.description,
      tags: this.tags.getValue(),
      _id: this._id
    };
  }

  @Input()
  public set image(value: Image) {
    this.imageData = value.data;
    this.description = value.description;
    this.tags.next(value.tags);
    this._id = value._id;
  }

  @Output()
  public saved = new EventEmitter<Image>();

  constructor() {}

  ngOnInit() {}

  // at the moment only one file can be added anyways, but in the future multiple may be possible
  // just add "multiple" to the file chooser input element to enable selection of multiple files
  // then handle all the files in event.target
  public onSelectFile(event) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if ((file.type as string).startsWith('image/', 0)) {
        // file is an image
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            this.imageData = reader.result;
          } else {
            console.log('bad image data');
          }
        };
        reader.readAsDataURL(file);
      } else {
        // file is no image
        console.log('only images are allowed');
      }
    }
  }

  public onTagInput(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.tags.next([...this.tags.getValue(), this.tagInput]);
      this.tagInput = '';
    }
  }

  public removeTag(index: number) {
    const newTags = this.tags.getValue();
    newTags.splice(index, 1);
    this.tags.next(newTags);
  }

  public onSave() {
    // emit the current image
    this.saved.emit(this.image);
    // reset component for next editing
    this.image = {
      _id: undefined,
      description: '',
      data: '',
      tags: []
    };
  }
}
