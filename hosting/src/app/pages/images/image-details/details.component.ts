import { Component, OnInit, OnDestroy } from '@angular/core';

import { AppImage } from 'src/app/utils/interfaces';
import { Store } from '@ngrx/store';
import { State } from '@state/images/reducers/image.reducer';
import { switchMap, map } from 'rxjs/operators';
import { UrlLoaderService } from '@services/url-loader.service';
import { SubscriptionService } from '@services/subscription.service';
import { LoadImage } from '@state/images/actions/image.actions';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  image$ = this.store.select('image', 'image');
  canEdit$ = this.store.select('user').pipe(map((state) => state.isAuthor || state.isAdmin));
  url$ = this.image$.pipe(switchMap((image) => this.urlLoader.getImageURL(image.id)));
  constructor(private store: Store<State>, private urlLoader: UrlLoaderService, private subs: SubscriptionService) {}

  ngOnInit() {
    this.store.dispatch(new LoadImage());
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }

  getLinkToArticles(val: AppImage): string {
    return `/articles/overview/${val.tags.join(',')}`;
  }
}
