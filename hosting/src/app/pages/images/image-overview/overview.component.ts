import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { AppImage } from '@utils/interfaces';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { SubscriptionService } from '@services/subscription.service';
import { LoadImagePage } from '@state/images/actions/image.actions';
import { canCreate } from '@state/persons';
import { cardFlyIn } from '@utils/animations/card-fly-in';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations: [cardFlyIn],
})
export class OverviewComponent implements OnInit, OnDestroy {
  data$: Observable<AppImage[]> = this.store.select('images', 'activePageImages');
  length$: Observable<number> = this.store.select('images', 'imageAmount');
  canCreate$: Observable<boolean> = this.store.select(canCreate);
  isLoading$ = this.store.select('images', 'isLoading');

  // Math.ceil guarantees that the colums will never get wider than the specified pixel width
  get cols(): number {
    return Math.ceil(this.hostRef.nativeElement.clientWidth / 450);
  }
  get limit(): number {
    return this.cols * 5;
  }

  constructor(
    private store: Store<State>,
    private subs: SubscriptionService,
    private hostRef: ElementRef<HTMLElement>,
    seo: SeoService
  ) {
    seo.setTags('Bilder Übersicht', 'Eine Überischt über alle Bilder der RöSeNa', undefined, '/images/overview');
  }

  ngOnInit() {
    this.store.dispatch(new LoadImagePage({ limit: this.limit }));
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
