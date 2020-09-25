import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { AppImage } from '@utils/interfaces';
import { Store } from '@ngrx/store';
import { State } from '@state/images/overview/reducers/image.reducer';
import { SubscriptionService } from '@services/subscription.service';
import { LoadImages } from '@state/images/overview/actions/image.actions';
import { canCreate } from '@state/user/selectors/user.selectors';
import { cardFlyIn } from '@utils/animations/card-fly-in';
import { Title } from '@angular/platform-browser';

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
    return Math.ceil(this.hostRef.nativeElement.clientWidth / 370);
  }
  get limit(): number {
    return this.cols * 5;
  }

  constructor(
    private store: Store<State>,
    private subs: SubscriptionService,
    private hostRef: ElementRef<HTMLElement>,
    titleService: Title
  ) {
    titleService.setTitle('RöSeNa - Bilder');
  }

  ngOnInit() {
    this.store.dispatch(new LoadImages({ limit: this.limit }));
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
