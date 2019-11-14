import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  @Output()
  search = new EventEmitter<string>();

  doSearch(searchString: string) {
    this.search.emit(searchString);
  }
}
