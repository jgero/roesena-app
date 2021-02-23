import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { CardsModule } from '@shared/cards/cards.module';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ArticleOverviewRoutingModule } from './article-overview-routing.module';
import { OverviewComponent } from './overview.component';
import { PaginatorModule } from '@shared/paginator/paginator.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeadingsModule } from '@shared/headings/headings.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    PaginatorModule,
    MatGridListModule,
    CardsModule,
    HeadingsModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    RouterModule,
    ArticleOverviewRoutingModule,
  ],
})
export class ArticleOverviewModule {}
