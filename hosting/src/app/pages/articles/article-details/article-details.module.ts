import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CardsModule } from '@shared/cards/cards.module';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MarkdownViewerModule } from '@shared/markdown-viewer/markdown-viewer.module';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ConvertersModule } from '@shared/converters/converters.module';
import { ArticleDetailsRoutingModule } from './article-details-routing.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [DetailsComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MarkdownViewerModule,
    MatButtonModule,
    CardsModule,
    ConvertersModule,
    ArticleDetailsRoutingModule,
  ],
})
export class ArticleDetailsModule {}
