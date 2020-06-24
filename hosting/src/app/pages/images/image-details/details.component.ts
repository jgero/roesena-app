import { Component, OnInit, OnDestroy } from '@angular/core';

import { AppImage } from 'src/app/utils/interfaces';
import { Store } from '@ngrx/store';
import { State } from '@state/images/reducers/image.reducer';
import { switchMap, map } from 'rxjs/operators';
import { UrlLoaderService } from '@services/url-loader.service';
import { SubscriptionService } from '@services/subscription.service';
import { LoadImage } from '@state/images/actions/image.actions';
import { AddSearchString, CleanSearch, ChangeDataType } from '@state/searching/actions/search.actions';
import { canEdit } from '@state/images/selectors/image.selectors';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  image$ = this.store.select('image', 'image');
  canEdit$ = this.store.select(canEdit);
  url$ = this.image$.pipe(switchMap((image) => this.urlLoader.getImageURL(image.id)));
  isLoading$ = this.store.select('image', 'isLoading');
  constructor(private store: Store<State>, private urlLoader: UrlLoaderService, private subs: SubscriptionService) {}

  ngOnInit() {
    this.store.dispatch(new LoadImage());
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }

  onTagClick(tag: string) {
    this.store.dispatch(new AddSearchString({ searchString: tag }));
  }

  fillSearchForArticles(val: AppImage): void {
    this.store.dispatch(new CleanSearch());
    val.tags.forEach((tag) => this.store.dispatch(new AddSearchString({ searchString: tag })));
    this.store.dispatch(new ChangeDataType({ dataType: 'articles' }));
  }
}
