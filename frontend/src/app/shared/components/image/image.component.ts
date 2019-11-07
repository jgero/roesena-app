import { Component, OnInit, Input } from '@angular/core';

import { Image } from 'src/app/interfaces';
import { Observable } from 'apollo-link';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {
  @Input()
  private image: Image = undefined;

  public src = new BehaviorSubject<string>(undefined);

  constructor() {}

  ngOnInit() {
    this.src.next(this.image.data);
  }
}
