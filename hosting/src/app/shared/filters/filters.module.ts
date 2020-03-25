import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CustomFormElementsModule } from "../custom-form-elements/custom-form-elements.module";

import { EventsByDatePipe } from "./events-by-date/events-by-date.pipe";
import { FilterImagesBySearchStringPipe } from "./images-by-search-string/filter-images-by-search-string.pipe";
import { SearchSortComponent } from "./search-sort/search-sort.component";
import { ArticlesByDatePipe } from "./articles-by-date/articles-by-date.pipe";

const pipes = [EventsByDatePipe, FilterImagesBySearchStringPipe, ArticlesByDatePipe];
const components = [SearchSortComponent];

@NgModule({
  declarations: [...pipes, ...components],
  imports: [CommonModule, CustomFormElementsModule],
  exports: [...pipes, ...components]
})
export class FiltersModule {}
