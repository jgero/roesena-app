import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { AppArticle, AppImage } from 'src/app/utils/interfaces';
import { Details } from 'src/app/utils/ui-abstractions';
import { ImageDalService } from 'src/app/services/DAL/image-dal.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-detail',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent extends Details {
  article: AppArticle;
  $image: Observable<AppImage>;

  constructor(imageDAO: ImageDalService, auth: AuthService, route: ActivatedRoute, router: Router) {
    super(auth);
    this.article = route.snapshot.data.article;
    this.$image = imageDAO.getBySearchStrings(this.article.tags, 1).pipe(map((imgs) => imgs[0]));
  }

  getLinkToImages(val: AppArticle): string {
    return `/images/overview/${val.tags.join(',')}`;
  }
}
