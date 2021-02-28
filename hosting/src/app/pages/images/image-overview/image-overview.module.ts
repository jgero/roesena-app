import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageOverviewRoutingModule } from './image-overview-routing.module';
import { OverviewComponent } from './overview.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { CardsModule } from '@shared/cards/cards.module';
import { PaginatorModule } from '@shared/paginator/paginator.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeadingsModule } from '@shared/headings/headings.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    ImageOverviewRoutingModule,
    MatToolbarModule,
    MatGridListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CardsModule,
    HeadingsModule,
    PaginatorModule,
    MatButtonModule,
    MatTooltipModule,
  ],
})
export class ImageOverviewModule {}
