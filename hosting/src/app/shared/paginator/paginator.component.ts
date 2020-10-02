import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { PageForward, PageBackwards } from '@state/pagination/actions/page.actions';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnInit {
  @Input()
  pageSize: number;
  @Input()
  pageIndex = 0;
  @Input()
  length: number;

  constructor(private store: Store<{}>, private compRef: ElementRef<HTMLElement>) {}

  onPage(event: PageEvent) {
    this.compRef.nativeElement.parentElement.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      if (event.pageIndex > event.previousPageIndex) {
        this.store.dispatch(new PageForward());
      } else {
        this.store.dispatch(new PageBackwards());
      }
    }, 300);
  }

  ngOnInit(): void {
    // this.paginatorRef._intl.nextPageLabel = 'Nächste Seite';
    // this.paginatorRef._intl.lastPageLabel = 'Vorherige Seite';
  }
}
