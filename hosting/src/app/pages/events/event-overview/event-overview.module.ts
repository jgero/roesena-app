import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventOverviewRoutingModule } from './event-overview-routing.module';
import { OverviewComponent } from './overview.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { CardsModule } from '@shared/cards/cards.module';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeadingsModule } from '@shared/headings/headings.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    EventOverviewRoutingModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatIconModule,
    CardsModule,
    HeadingsModule,
    MatButtonModule,
    MatTooltipModule,
  ],
})
export class EventOverviewModule {}
