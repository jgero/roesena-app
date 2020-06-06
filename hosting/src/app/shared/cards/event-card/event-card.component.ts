import { Component, Input, OnInit } from '@angular/core';

import { AppEvent } from '../../../utils/interfaces';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AddSearchString } from '@state/searching/actions/search.actions';
import { State } from '@state/state.module';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  @Input()
  data: AppEvent;

  canEdit$ = this.store.select('user').pipe(map((state) => state.isAuthor || state.isAdmin));
  unseen$: Observable<number>;
  status$: Observable<string>;

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.unseen$ = this.store.select('user', 'user').pipe(
      map((user) => {
        const part = this.data.participants.find((p) => p.id === user.id);
        if (!part) {
          return null;
        }
        return part.hasUnseenChanges ? 1 : null;
      })
    );
    this.status$ = this.store.select('user', 'user').pipe(
      map((user) => {
        const part = this.data.participants.find((p) => p.id === user.id);
        if (!part) {
          return '';
        }
        switch (part.amount) {
          case -1:
            return 'Rückmeldung ausstehend';
          case 0:
            return 'abgelehnt';
          default:
            return 'angemeldet';
        }
      })
    );
  }

  onTagClick(tag: string) {
    this.store.dispatch(new AddSearchString({ searchString: tag }));
  }
}
