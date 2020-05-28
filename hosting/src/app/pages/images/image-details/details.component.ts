import { Component } from '@angular/core';

import { AppImage } from 'src/app/utils/interfaces';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  constructor() {}

  getLinkToArticles(val: AppImage): string {
    return `/articles/overview/${val.tags.join(',')}`;
  }
}
