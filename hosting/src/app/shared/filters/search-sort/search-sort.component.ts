import { Component, HostBinding, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-search-sort",
  templateUrl: "./search-sort.component.html",
  styleUrls: ["./search-sort.component.scss"]
})
export class SearchSortComponent {
  @HostBinding("class") get classes(): string {
    return this.hasSorting ? "card sorting" : "card";
  }

  @Input()
  searchString = "";
  @Output()
  searchStringChange = new EventEmitter<string>();

  @Input()
  hasSorting = false;

  @Input()
  descending = true;
  @Output()
  descendingChange = new EventEmitter<boolean>();

  toggleDescending() {
    this.descending = !this.descending;
    this.descendingChange.emit(this.descending);
  }
}
