import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { State } from '@state/pagination/reducers/page.reducer';
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
  pageIndex: number = 0;
  @Input()
  length: number;

  constructor(private store: Store<State>, private compRef: ElementRef<HTMLElement>) {}

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

  ngOnInit(): void {}
}
