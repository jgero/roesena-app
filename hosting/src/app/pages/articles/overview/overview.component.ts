import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { ArticleDalService } from 'src/app/services/DAL/article-dal.service';
import { cardFlyIn } from 'src/app/utils/animations';
import { AppArticle } from 'src/app/utils/interfaces';
import { PaginatedOverview } from 'src/app/utils/ui-abstractions';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations: [cardFlyIn],
})
export class OverviewComponent extends PaginatedOverview {
  $data: Observable<AppArticle[]>;

  constructor(auth: AuthService, articleDAO: ArticleDalService, route: ActivatedRoute, router: Router) {
    super(['articles', 'overview'], articleDAO, route, router, auth);
  }
}
