import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Image } from 'src/app/interfaces';

@Component({
  selector: 'app-image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.scss']
})
export class ImageCardComponent implements OnInit {
  @Input()
  public image: Image;

  @Output()
  public edit = new EventEmitter<string>();
  @Output()
  public details = new EventEmitter<string>();
  @Output()
  public delete = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  public onEdit() {
    this.edit.emit(this.image._id);
  }

  public onDetails() {
    this.details.emit(this.image._id);
  }

  public onDelete() {
    this.delete.emit(this.image._id);
  }
}
