import { Component, OnInit, OnDestroy } from '@angular/core';

import { AppArticle } from 'src/app/utils/interfaces';
import { Store } from '@ngrx/store';
import { State } from '@state/articles/reducers/article.reducer';
import { LoadSingleArticle } from '@state/articles/actions/article.actions';
import { map } from 'rxjs/operators';
import { SubscriptionService } from '@services/subscription.service';
import { canEdit } from '@state/articles/selectors/article.selectors';
import { AddSearchString, ChangeDataType, CleanSearch } from '@state/searching/actions/search.actions';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-detail',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnDestroy {
  article$ = this.store.select('article', 'article');
  image$ = this.store.select('article', 'image');
  isLoading$ = this.store.select('article', 'isLoading');
  canEdit$ = this.store.select(canEdit);

  constructor(private store: Store<State>, private sub: SubscriptionService, titleService: Title) {
    titleService.setTitle('RöSeNa - Artikel Details');
    this.store.dispatch(new LoadSingleArticle());
  }

  onTagClick(tag: string) {
    this.store.dispatch(new AddSearchString({ searchString: tag }));
  }

  fillSearchForImages(val: AppArticle): void {
    this.store.dispatch(new CleanSearch());
    val.tags.forEach((tag) => this.store.dispatch(new AddSearchString({ searchString: tag })));
    this.store.dispatch(new ChangeDataType({ dataType: 'images' }));
  }

  ngOnDestroy() {
    this.sub.unsubscribeComponent$.next();
  }
}
