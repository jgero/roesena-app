import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { ArticleDalService } from 'src/app/services/DAL/article-dal.service';
import { cardFlyIn } from 'src/app/utils/animations';
import { AppArticle } from 'src/app/utils/interfaces';
import { PaginatedOverview } from 'src/app/utils/ui-abstractions';
import { Store, select } from '@ngrx/store';
import { updateSearchStrings } from 'src/app/actions/article-overview.actions';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations: [cardFlyIn],
})
export class OverviewComponent {
  $data: Observable<AppArticle[]> = this.store.select((state) => state.articles.articles);

  constructor(
    auth: AuthService,
    articleDAO: ArticleDalService,
    route: ActivatedRoute,
    router: Router,
    public store: Store<{ articles: AppArticle[] }>
  ) {
    store.pipe(select('articles')).subscribe((el) => console.log(el));
    store.dispatch(updateSearchStrings({ searchStrings: [] }));
  }
}
