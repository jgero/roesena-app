import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EventsByDatePipe } from "./events-by-date/events-by-date.pipe";
import { FilterImagesBySearchStringPipe } from "./images-by-search-string/filter-images-by-search-string.pipe";
import { ArticlesByDatePipe } from "./articles-by-date/articles-by-date.pipe";
import { SortParticipantsPipe } from "./participants/sort-participants.pipe";

const pipes = [EventsByDatePipe, FilterImagesBySearchStringPipe, ArticlesByDatePipe, SortParticipantsPipe];

@NgModule({
  declarations: [...pipes],
  imports: [CommonModule],
  exports: [...pipes],
})
export class FiltersModule {}
