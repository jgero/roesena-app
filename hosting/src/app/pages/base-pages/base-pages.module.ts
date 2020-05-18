import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { MarkdownViewerModule } from '@shared/markdown-viewer/markdown-viewer.module';
import { CardsModule } from '@shared/cards/cards.module';

import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RootComponent } from './root/root.component';
import { StartPageComponent } from './start-page/start-page.component';

@NgModule({
  declarations: [AboutComponent, HelpComponent, NotFoundComponent, RootComponent, StartPageComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatBadgeModule,
    MatExpansionModule,
    MatIconModule,
    MatToolbarModule,
    MarkdownViewerModule,
    MatButtonModule,
    CardsModule,
  ],
  exports: [AboutComponent, HelpComponent, NotFoundComponent, RootComponent, StartPageComponent],
})
export class BasePagesModule {}
