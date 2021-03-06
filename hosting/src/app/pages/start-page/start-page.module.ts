import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StartPageRoutingModule } from './start-page-routing.module';
import { StartPageComponent } from './start-page.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MarkdownViewerModule } from '@shared/markdown-viewer/markdown-viewer.module';
import { ConvertersModule } from '@shared/converters/converters.module';
import { CardsModule } from '@shared/cards/cards.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [StartPageComponent],
  imports: [
    CommonModule,
    StartPageRoutingModule,
    MarkdownViewerModule,
    ConvertersModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    CardsModule,
  ],
})
export class StartPageModule {}
