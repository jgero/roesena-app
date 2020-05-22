import { Component, Input, Output, EventEmitter } from '@angular/core';

import { AppArticle } from 'src/app/utils/interfaces';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { State } from '@state/cards/reducers/card.reducer';
import { TagClick } from '@state/cards/actions/card.actions';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
})
export class ArticleCardComponent {
  @Input()
  data: AppArticle;

  canEdit$ = this.store.select('user').pipe(map((state) => state.isAuthor || state.isAdmin));

  constructor(private store: Store<State>) {}

  onTagClick(tag: string) {
    this.store.dispatch(new TagClick({ tag }));
  }
}
