import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@state/groups/reducers/content.reducer';
import { SubscriptionService } from '@services/subscription.service';
import { LoadContent } from '@state/groups/actions/content.actions';

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss'],
})
export class CommonComponent implements OnDestroy, OnInit {
  textData$ = this.store.select('group', 'article');
  imageData$ = this.store.select('group', 'image');
  groupName$ = this.store.select('router', 'state', 'data', 'groupName');
  externalPageLink$ = this.store.select('router', 'state', 'data', 'externalPageLink');

  constructor(private store: Store<State>, private subs: SubscriptionService) {}

  ngOnInit() {
    this.store.dispatch(new LoadContent());
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
