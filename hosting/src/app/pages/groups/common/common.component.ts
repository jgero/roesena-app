import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { SubscriptionService } from '@services/subscription.service';
import { SeoService } from '@services/seo.service';
import { tap } from 'rxjs/operators';
import { LoadSingleImage } from '@state/images';
import { LoadSingleArticle } from '@state/articles';

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss'],
})
export class CommonComponent implements OnDestroy {
  textData$ = this.store.select('articles', 'activeArticle');
  imageUrl$ = this.store.select('images', 'activeImageFullUrl');
  groupName$ = this.store.select('router', 'state', 'data', 'groupName').pipe(
    tap((el) => {
      this.seo.setTags(el, `Gruppen der RöSeNa: ${el}`, undefined, `/groups/${el}`);
      this.store.dispatch(new LoadSingleImage({ tags: [el, 'Gruppenseite'] }));
      this.store.dispatch(new LoadSingleArticle({ tags: [el, 'Gruppenseite'] }));
    })
  );
  externalPageLink$ = this.store.select('router', 'state', 'data', 'externalPageLink');

  constructor(private store: Store<State>, private subs: SubscriptionService, private seo: SeoService) {}

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
