import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { AppImage } from '@utils/interfaces';
import { Store } from '@ngrx/store';
import { State } from '@state/images/overview/reducers/image.reducer';
import { SubscriptionService } from '@services/subscription.service';
import { LoadImages } from '@state/images/overview/actions/image.actions';
import { canCreate } from '@state/user/selectors/user.selectors';
import { cardFlyIn } from '@utils/animations/card-fly-in';
import { SeoService } from '@services/seo.service';
import { UrlLoaderService } from '@services/url-loader.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations: [cardFlyIn],
})
export class OverviewComponent implements OnInit, OnDestroy {
  data$: Observable<AppImage[]> = this.store.select('imageOverview', 'images');
  length$: Observable<number> = this.store.select('imageOverview', 'length');
  canCreate$: Observable<boolean> = this.store.select(canCreate);
  isLoading$ = this.store.select('imageOverview', 'isLoading');

  // Math.ceil guarantees that the colums will never get wider than the specified pixel width
  get cols(): number {
    return Math.ceil(this.hostRef.nativeElement.clientWidth / 450);
  }
  get limit(): number {
    return this.cols * 5;
  }

  isCarouselVisible = false;
  carouselIndex = 0;
  carouselUrl = '';
  openCarousel(images: AppImage[]) {
    this.isCarouselVisible = true;
    this.carouselIndex = 0;
    this.loadCaruselUrl(images);
  }
  closeCarousel() {
    this.isCarouselVisible = false;
  }
  carouselNext(images: AppImage[]) {
    this.carouselIndex++;
    this.loadCaruselUrl(images);
  }
  carouselPrevious(images: AppImage[]) {
    this.carouselIndex--;
    this.loadCaruselUrl(images);
  }
  private loadCaruselUrl(images: AppImage[]) {
    if (images.length > this.carouselIndex) {
      this.urlLoader
        .getImageURL(images[this.carouselIndex].id, false)
        .pipe(take(1))
        .subscribe((url) => (this.carouselUrl = url));
    }
  }

  constructor(
    private store: Store<State>,
    private subs: SubscriptionService,
    public urlLoader: UrlLoaderService,
    private hostRef: ElementRef<HTMLElement>,
    seo: SeoService
  ) {
    seo.setTags('Bilder Übersicht', 'Eine Überischt über alle Bilder der RöSeNa', undefined, '/images/overview');
  }

  ngOnInit() {
    this.store.dispatch(new LoadImages({ limit: this.limit }));
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
