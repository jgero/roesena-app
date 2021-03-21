import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { ChangeDataType, RunSearch } from '@state/searching/actions/search.actions';

@Component({
  selector: 'app-multi-type',
  templateUrl: './multi-type.component.html',
  styleUrls: ['./multi-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiTypeComponent {
  events$ = this.store.select('search', 'events');
  images$ = this.store.select('search', 'images');
  articles$ = this.store.select('search', 'articles');

  constructor(private store: Store<State>) {}

  swtichToSingleType(type: string) {
    this.store.dispatch(new ChangeDataType({ dataTypes: [type] }));
    this.store.dispatch(new RunSearch());
  }
}
