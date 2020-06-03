import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent, SearchSheet } from './search-bar/search-bar.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ConvertersModule } from '../converters/converters.module';
import { MatBottomSheetModule, MAT_BOTTOM_SHEET_DEFAULT_OPTIONS } from '@angular/material/bottom-sheet';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [SearchBarComponent, SearchSheet],
  exports: [SearchBarComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatRadioModule,
    ConvertersModule,
  ],
  providers: [{ provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }],
})
export class SearchModule {}
