import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@state/basePages/reducers/base.reducer';
import { LoadHelpArticle } from '@state/basePages/actions/base.actions';
import { SubscriptionService } from '@services/subscription.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnDestroy {
  $textData = this.store.select('base', 'helpArticle');

  constructor(private store: Store<State>, private subs: SubscriptionService) {
    this.store.dispatch(new LoadHelpArticle());
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
