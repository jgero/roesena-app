import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EventsByDatePipe } from "./events-by-date/events-by-date.pipe";
import { FilterImagesBySearchStringPipe } from "./images-by-search-string/filter-images-by-search-string.pipe";

const pipes = [EventsByDatePipe, FilterImagesBySearchStringPipe];

@NgModule({
  declarations: pipes,
  imports: [CommonModule],
  exports: pipes
})
export class FiltersModule {}
