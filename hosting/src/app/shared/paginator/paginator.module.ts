import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from './paginator.component';
import { StoreModule } from '@ngrx/store';
import * as fromPage from '../../state/pagination/reducers/page.reducer';
import { EffectsModule } from '@ngrx/effects';
import { PageEffects } from '../../state/pagination/effects/page.effects';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [PaginatorComponent],
  imports: [
    CommonModule,
    MatPaginatorModule,
    StoreModule.forFeature(fromPage.pageFeatureKey, fromPage.reducer),
    EffectsModule.forFeature([PageEffects]),
  ],
  exports: [PaginatorComponent],
})
export class PaginatorModule {}
