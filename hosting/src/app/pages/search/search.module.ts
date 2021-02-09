import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { HeadingsModule } from '@shared/headings/headings.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { CardsModule } from '@shared/cards/cards.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [SearchComponent],
  imports: [CommonModule, SearchRoutingModule, HeadingsModule, MatGridListModule, MatButtonModule, CardsModule],
})
export class SearchModule {}
