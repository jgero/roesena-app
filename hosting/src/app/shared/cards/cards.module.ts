import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { ConvertersModule } from '../converters/converters.module';

import { EventCardComponent } from './event-card/event-card.component';
import { ImageCardComponent } from './image-card/image-card.component';
import { ArticleCardComponent } from './article-card/article-card.component';
import { MatBadgeModule } from '@angular/material/badge';
import { StoreModule } from '@ngrx/store';
import * as fromCard from '@state/cards/reducers/card.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CardEffects } from '@state/cards/effects/card.effects';

const components = [EventCardComponent, ImageCardComponent, ArticleCardComponent];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    RouterModule,
    ConvertersModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    StoreModule.forFeature(fromCard.cardFeatureKey, fromCard.reducer),
    EffectsModule.forFeature([CardEffects]),
  ],
  exports: components,
})
export class CardsModule {}
