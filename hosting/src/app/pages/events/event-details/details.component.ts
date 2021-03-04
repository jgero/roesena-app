import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { SubscriptionService } from '@services/subscription.service';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { LoadSingleEvent, MarkEventAsSeen } from '@state/events/actions/event.actions';
import { map, tap } from 'rxjs/operators';
import { AddSearchString } from '@state/searching/actions/search.actions';
import { Participant } from '@utils/interfaces';
import { canEdit, canReply } from '@state/events';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnDestroy, OnInit {
  displayedColumns = ['name', 'amount'];
  canEdit$ = this.store.select(canEdit);
  canReply$: Observable<boolean> = this.store.select(canReply);
  isLoading$ = this.store.select('events', 'isLoading');

  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    if (this.dataSource) {
      this.dataSource.sort = sort;
    }
    this.sort = sort;
  }
  sort: MatSort;
  dataSource: MatTableDataSource<Participant>;
  data$ = this.store.select('events', 'activeEvent').pipe(
    tap((el) => {
      if (!el) {
        return;
      }
      this.seo.setTags(el.title, el.description.substring(0, 30).concat('...'), undefined, `/events/details/${el.id}`);
      this.dataSource = new MatTableDataSource(el.participants);
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    })
  );
  amountAccumulated$ = this.data$.pipe(
    map((event) => {
      let amount = 0;
      event.participants.forEach((part) => {
        if (part.amount < 0) {
          return;
        }
        amount += part.amount;
      });
      return amount;
    })
  );

  constructor(private store: Store<State>, private subs: SubscriptionService, private seo: SeoService) {}

  ngOnInit() {
    this.store.dispatch(new LoadSingleEvent());
    this.store.dispatch(new MarkEventAsSeen());
  }

  onTagClick(tag: string) {
    this.store.dispatch(new AddSearchString({ searchString: tag }));
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
