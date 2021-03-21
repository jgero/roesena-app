import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { AutocompleteService } from '@services/autocomplete.service';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { map, tap, take, takeUntil } from 'rxjs/operators';
import { tagProposals } from '@state/searching/selectors/search.selectors';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {
  AddSearchString,
  RemoveSearchString,
  ChangeDataType,
  RunSearch,
  CleanSearch,
} from '@state/searching/actions/search.actions';
import { SubscriptionService } from '@services/subscription.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  searchStrings$ = this.store.select('search', 'searchStrings');
  tagProposals$ = this.store.select(tagProposals);
  isArticlesChecked = false;
  isImagesChecked = false;
  isEventsChecked = false;
  heading = 'Suchergebnisse';

  @ViewChild('chipInput')
  chipInput: ElementRef<HTMLInputElement>;

  constructor(public autocomplete: AutocompleteService, private store: Store<State>, private subs: SubscriptionService) {
    this.store
      .select('search', 'dataTypes')
      .pipe(takeUntil(this.subs.unsubscribe$))
      .subscribe((types) => {
        setTimeout(() => {
          this.isArticlesChecked = types.includes('articles');
          this.isImagesChecked = types.includes('images');
          this.isEventsChecked = types.includes('events');
          if (types.length > 1) {
            this.heading = 'Suchergebnisse';
          } else {
            switch (types[0]) {
              case 'events':
                this.heading = 'Events';
                break;
              case 'articles':
                this.heading = 'Artikel';
                break;
              case 'images':
                this.heading = 'Bilder';
                break;
            }
          }
        });
      });
  }

  ngOnInit(): void {
    // initialize when landing on the search page
    this.store.pipe(take(1)).subscribe((state) => {
      const types: string[] = state.router.state.params.type.split(',');
      // init checkbox state
      this.isEventsChecked = types.includes('events');
      this.isArticlesChecked = types.includes('articles');
      this.isImagesChecked = types.includes('images');
      // init heading
      if (types.length > 1) {
        this.heading = 'Suchergebnisse';
      } else {
        switch (types[0]) {
          case 'events':
            this.heading = 'Events';
            break;
          case 'articles':
            this.heading = 'Artikel';
            break;
          case 'images':
            this.heading = 'Bilder';
            break;
        }
      }
    });
  }

  onAddTag(event: MatAutocompleteSelectedEvent, input: HTMLInputElement) {
    input.value = '';
    this.store.dispatch(new AddSearchString({ searchString: event.option.value }));
  }

  onAddProposal(tag: string) {
    this.store.dispatch(new AddSearchString({ searchString: tag }));
  }

  onRemoveTag(searchString: string) {
    this.store.dispatch(new RemoveSearchString({ searchString }));
  }

  onCheckboxChange() {
    const dataTypes: string[] = [];
    if (this.isArticlesChecked) {
      dataTypes.push('articles');
    }
    if (this.isImagesChecked) {
      dataTypes.push('images');
    }
    if (this.isEventsChecked) {
      dataTypes.push('events');
    }
    this.store.dispatch(new ChangeDataType({ dataTypes }));
    this.store.dispatch(new RunSearch());
  }

  swtichToSingleType(type: string) {
    this.store.dispatch(new ChangeDataType({ dataTypes: [type] }));
    this.store.dispatch(new RunSearch());
  }

  onClearSearch() {
    this.store.dispatch(new CleanSearch());
  }

  onSearch() {
    if (this.chipInput.nativeElement.value !== '') {
      this.store.dispatch(new AddSearchString({ searchString: this.chipInput.nativeElement.value }));
      this.chipInput.nativeElement.value = '';
    }
    this.store.dispatch(new RunSearch());
  }
}
