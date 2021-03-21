import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { State } from '@state/state.module';
import { Store } from '@ngrx/store';
import { SubscriptionService } from '@services/subscription.service';
import { SeoService } from '@services/seo.service';
import { forStartpage as eventForStartpage } from '@state/events';
import { LoadSingleArticle, LoadArticleSelection } from '@state/articles';
import { LoadStartPage } from '@state/images';
import { LoadUpcomingEvents } from '@state/events';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
})
export class StartPageComponent implements OnInit, OnDestroy {
  images$ = this.store.select('images', 'startpageTiles');
  event$ = this.store.select(eventForStartpage);
  article$ = this.store.select('articles', 'activeArticle');
  articleSelection$ = this.store.select('articles', 'activeArticleSelection');

  get tilesPerRow(): number {
    if (this.hostRef.nativeElement.clientWidth > 600) {
      return 2;
    }
    return 1;
  }

  get hasTwoImagesPerTile(): boolean {
    return this.hostRef.nativeElement.clientWidth > 1000;
  }

  get tileGridSize(): string {
    if (this.tilesPerRow === 1 && !this.hasTwoImagesPerTile) {
      return 'narrow';
    } else if (this.tilesPerRow === 2 && !this.hasTwoImagesPerTile) {
      return 'medium';
    } else {
      return 'wide';
    }
  }

  constructor(
    private store: Store<State>,
    private subs: SubscriptionService,
    seo: SeoService,
    private hostRef: ElementRef<HTMLElement>
  ) {
    seo.setTags(undefined, 'Webseite der Röhlinger Sechtanarren', undefined, '/');
  }

  getRowStyle(index: number): boolean {
    return Math.floor(index / this.tilesPerRow) % 2 === 1;
  }

  ngOnInit() {
    if (this.tileGridSize === 'narrow') {
      this.store.dispatch(new LoadStartPage({ tileAmount: this.tilesPerRow * 3 }));
    } else if (this.tileGridSize === 'medium') {
      this.store.dispatch(new LoadStartPage({ tileAmount: this.tilesPerRow * 2 - 1 }));
    } else {
      this.store.dispatch(new LoadStartPage({ tileAmount: this.tilesPerRow * 2 }));
    }
    this.store.dispatch(new LoadSingleArticle({ tags: ['Startseite'] }));
    this.store.dispatch(new LoadArticleSelection({ tags: ['News'], limit: 4 }));
    this.store.dispatch(new LoadUpcomingEvents());
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
