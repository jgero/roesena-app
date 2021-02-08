import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteFilterPipe } from './autocomplete-filter.pipe';

const pipes = [AutocompleteFilterPipe];

@NgModule({
  declarations: pipes,
  imports: [CommonModule],
  exports: pipes,
})
export class FiltersModule {}
