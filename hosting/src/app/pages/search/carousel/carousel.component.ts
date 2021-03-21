import { Component, Input, OnInit } from '@angular/core';
import { UrlLoaderService } from '@services/url-loader.service';
import { take, tap, map, takeUntil } from 'rxjs/operators';
import { Subject, Observable, merge } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { SubscriptionService } from '@services/subscription.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
  constructor(private urlLoader: UrlLoaderService, store: Store<State>, subs: SubscriptionService) {
    store
      .select('search', 'images')
      .pipe(
        takeUntil(subs.unsubscribe$),
        map((images) => images.map((image) => image.id))
      )
      .subscribe((imagesData) => (this.imageIds = imagesData));
  }

  get hasNext(): boolean {
    return this.carouselIndex != this.imageIds.length - 1;
  }
  get hasPrevious(): boolean {
    return this.carouselIndex != 0;
  }
  @Input()
  openCarouselWithId: Observable<string>;
  closeCarousel = new Subject<void>();
  isCarouselVisible: Observable<boolean>;
  carouselIndex = 0;
  carouselUrl = '';
  imageIds: string[] = [];

  ngOnInit() {
    this.isCarouselVisible = merge(
      this.openCarouselWithId.pipe(
        tap((id) => {
          this.carouselIndex = this.imageIds.findIndex((el) => el === id);
          this.loadCaruselUrl();
          this.carouselUrl = '';
        }),
        map((_) => true)
      ),
      this.closeCarousel.pipe(map((_) => false))
    );
  }

  onCloseCarousel() {
    this.closeCarousel.next();
  }

  carouselNext() {
    this.carouselIndex++;
    this.loadCaruselUrl();
  }
  carouselPrevious() {
    this.carouselIndex--;
    this.loadCaruselUrl();
  }
  private loadCaruselUrl() {
    this.urlLoader
      .getImageURL(this.imageIds[this.carouselIndex], false)
      .pipe(take(1))
      .subscribe((url) => (this.carouselUrl = url));
  }
}
