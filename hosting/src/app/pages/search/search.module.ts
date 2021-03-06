import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { CardsModule } from '@shared/cards/cards.module';
import { MatButtonModule } from '@angular/material/button';
import { FiltersModule } from '@shared/filters/filters.module';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from '@shared/paginator/paginator.module';
import { HeaderComponent } from './header/header.component';
import { HintsComponent } from './hints/hints.component';
import { SingleTypeComponent } from './single-type/single-type.component';
import { MultiTypeComponent } from './multi-type/multi-type.component';
import { CarouselComponent } from './carousel/carousel.component';

@NgModule({
  declarations: [SearchComponent, HeaderComponent, HintsComponent, SingleTypeComponent, MultiTypeComponent, CarouselComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,
    MatGridListModule,
    MatButtonModule,
    CardsModule,
    FiltersModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatCheckboxModule,
    PaginatorModule,
    FormsModule,
  ],
})
export class SearchModule {}
