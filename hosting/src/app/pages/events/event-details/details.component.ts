import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { SubscriptionService } from '@services/subscription.service';
import { Store } from '@ngrx/store';
import { State } from '@state/events/reducers/event.reducer';
import { LoadEvent, MarkEventAsSeen } from '@state/events/actions/event.actions';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { AddSearchString, CleanSearch, ChangeDataType } from '@state/searching/actions/search.actions';
import { AppEvent, Participant } from '@utils/interfaces';
import { Title } from '@angular/platform-browser';
import { canEdit, canReply } from '@state/events/selectors/event.selectors';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

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
  data$ = this.store.select('events', 'event').pipe(
    tap((el) => {
      if (!el) {
        return;
      }
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

  constructor(private store: Store<State>, private subs: SubscriptionService, titleService: Title) {
    titleService.setTitle('RöSeNa - Event Details');
  }

  ngOnInit() {
    this.store.dispatch(new LoadEvent());
    this.store.dispatch(new MarkEventAsSeen());
  }

  onTagClick(tag: string) {
    this.store.dispatch(new AddSearchString({ searchString: tag }));
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
