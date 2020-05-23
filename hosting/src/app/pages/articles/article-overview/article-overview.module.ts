import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SearchModule } from '@shared/search/search.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { CardsModule } from '@shared/cards/cards.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatProgressBarModule,
    SearchModule,
    MatGridListModule,
    CardsModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  exports: [OverviewComponent],
})
export class ArticleOverviewModule {}
