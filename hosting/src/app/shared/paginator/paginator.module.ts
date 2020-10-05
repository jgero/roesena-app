import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from './paginator.component';
import { StoreModule } from '@ngrx/store';
import * as fromPage from '../../state/pagination/reducers/page.reducer';
import { EffectsModule } from '@ngrx/effects';
import { PageEffects } from '../../state/pagination/effects/page.effects';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';

@Injectable()
class CustomMatPaginatorIntl extends MatPaginatorIntl {
  nextPageLabel = 'Nächste Seite';
  previousPageLabel = 'Vorherige Seite';

  getRangeLabel = (page, pageSize, length) => {
    if (length === 0 || pageSize === 0) {
      return '0 von ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' von ' + length;
  };
}

@NgModule({
  declarations: [PaginatorComponent],
  imports: [
    CommonModule,
    MatPaginatorModule,
    StoreModule.forFeature(fromPage.pageFeatureKey, fromPage.reducer),
    EffectsModule.forFeature([PageEffects]),
  ],
  exports: [PaginatorComponent],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }],
})
export class PaginatorModule {}
