import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { StoreModule } from '@ngrx/store';
import * as fromEvent from '../../state/events/reducers/event.reducer';
import { EffectsModule } from '@ngrx/effects';
import { EventEffects } from '../../state/events/effects/event.effects';

@NgModule({
  declarations: [],
  imports: [CommonModule, EventsRoutingModule, StoreModule.forFeature(fromEvent.eventFeatureKey, fromEvent.reducer), EffectsModule.forFeature([EventEffects])],
})
export class EventsModule {}
