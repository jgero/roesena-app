import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageOverviewRoutingModule } from './image-overview-routing.module';
import { StoreModule } from '@ngrx/store';
import * as fromImage from '../../../state/images/overview/reducers/image.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ImageEffects } from '../../../state/images/overview/effects/image.effects';
import { OverviewComponent } from './overview.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { CardsModule } from '@shared/cards/cards.module';
import { PaginatorModule } from '@shared/paginator/paginator.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    ImageOverviewRoutingModule,
    MatToolbarModule,
    MatGridListModule,
    MatIconModule,
    CardsModule,
    PaginatorModule,
    MatButtonModule,
    StoreModule.forFeature(fromImage.imageFeatureKey, fromImage.reducer),
    EffectsModule.forFeature([ImageEffects]),
  ],
})
export class ImageOverviewModule {}
