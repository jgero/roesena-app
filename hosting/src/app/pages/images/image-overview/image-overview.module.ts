import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageOverviewRoutingModule } from './image-overview-routing.module';
import { StoreModule } from '@ngrx/store';
import * as fromImage from '../../../state/images/overview/reducers/image.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ImageEffects } from '../../../state/images/overview/effects/image.effects';
import { OverviewComponent } from './overview.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SearchModule } from '@shared/search/search.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { CardsModule } from '@shared/cards/cards.module';
import { PaginatorModule } from '@shared/paginator/paginator.module';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    ImageOverviewRoutingModule,
    MatToolbarModule,
    SearchModule,
    MatGridListModule,
    CardsModule,
    PaginatorModule,
    StoreModule.forFeature(fromImage.imageFeatureKey, fromImage.reducer),
    EffectsModule.forFeature([ImageEffects]),
  ],
})
export class ImageOverviewModule {}
