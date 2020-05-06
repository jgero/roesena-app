import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppImage } from 'src/app/utils/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { Details } from 'src/app/utils/ui-abstractions';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent extends Details {
  image: AppImage;
  url: string;
  constructor(public route: ActivatedRoute, auth: AuthService) {
    super(auth);
    this.image = route.snapshot.data.image;
    this.url = route.snapshot.data.url;
  }

  getLinkToArticles(val: AppImage): string {
    return `/articles/overview/${val.tags.join(',')}`;
  }
}
