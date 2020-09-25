import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent, SearchSheetComponent } from './search-bar/search-bar.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ConvertersModule } from '../converters/converters.module';
import { MatBottomSheetModule, MAT_BOTTOM_SHEET_DEFAULT_OPTIONS } from '@angular/material/bottom-sheet';
import { MatRadioModule } from '@angular/material/radio';
import { SearchPageComponent } from './search-page/search-page.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { CardsModule } from '@shared/cards/cards.module';
import { HeadingsModule } from '@shared/headings/headings.module';

@NgModule({
  declarations: [SearchBarComponent, SearchSheetComponent, SearchPageComponent],
  exports: [SearchBarComponent, SearchPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    HeadingsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatRadioModule,
    MatToolbarModule,
    MatGridListModule,
    CardsModule,
    ConvertersModule,
  ],
  providers: [{ provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }],
})
export class SearchModule {}
