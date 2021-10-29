import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

// material modules that have providers are imported here
@NgModule({
  declarations: [],
  imports: [CommonModule, MatSnackBarModule, MatNativeDateModule, MatBottomSheetModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de' },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000 } },
  ],
})
export class MaterialModule {}
