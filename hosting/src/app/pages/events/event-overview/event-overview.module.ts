import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventOverviewRoutingModule } from './event-overview-routing.module';
import { OverviewComponent } from './overview.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { CardsModule } from '@shared/cards/cards.module';
import { MatButtonModule } from '@angular/material/button';
import { StoreModule } from '@ngrx/store';
import * as fromEvent from '../../../state/events/overview/reducers/event.reducer';
import { EffectsModule } from '@ngrx/effects';
import { EventEffects } from '../../../state/events/overview/effects/event.effects';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    EventOverviewRoutingModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatGridListModule,
    MatIconModule,
    CardsModule,
    MatButtonModule,
    StoreModule.forFeature(fromEvent.eventFeatureKey, fromEvent.reducer),
    EffectsModule.forFeature([EventEffects]),
  ],
})
export class EventOverviewModule {}
