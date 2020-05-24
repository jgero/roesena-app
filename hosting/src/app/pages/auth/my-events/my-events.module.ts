import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyEventsRoutingModule } from './my-events-routing.module';
import { MyEventsComponent } from './my-events.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ConvertersModule } from '@shared/converters/converters.module';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StoreModule } from '@ngrx/store';
import * as fromEvents from '../../../state/auth/my-events/reducers/events.reducer';
import { EffectsModule } from '@ngrx/effects';
import { EventsEffects } from '../../../state/auth/my-events/effects/events.effects';

@NgModule({
  declarations: [MyEventsComponent],
  imports: [
    CommonModule,
    MyEventsRoutingModule,
    MatToolbarModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatBadgeModule,
    MatInputModule,
    ReactiveFormsModule,
    ConvertersModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    StoreModule.forFeature(fromEvents.eventsFeatureKey, fromEvents.reducer),
    EffectsModule.forFeature([EventsEffects]),
  ],
})
export class MyEventsModule {}
