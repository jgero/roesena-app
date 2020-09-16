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
import { MatMenuModule } from '@angular/material/menu';

import { MarkdownViewerModule } from '@shared/markdown-viewer/markdown-viewer.module';

import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RootComponent } from './root/root.component';
import { StartPageComponent } from './start-page/start-page.component';
import { StoreModule } from '@ngrx/store';
import * as fromBase from '../../state/basePages/reducers/base.reducer';
import { EffectsModule } from '@ngrx/effects';
import { BaseEffects } from '../../state/basePages/effects/base.effects';
import { HttpClientModule } from '@angular/common/http';
import { SearchModule } from '@shared/search/search.module';
import { ConvertersModule } from '@shared/converters/converters.module';
import { FooterComponent } from './root/footer/footer.component';

@NgModule({
  declarations: [AboutComponent, HelpComponent, NotFoundComponent, RootComponent, StartPageComponent, FooterComponent],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    MatListModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatBadgeModule,
    MatExpansionModule,
    MatIconModule,
    MatToolbarModule,
    MarkdownViewerModule,
    MatButtonModule,
    MatMenuModule,
    ConvertersModule,
    SearchModule,
    StoreModule.forFeature(fromBase.baseFeatureKey, fromBase.reducer),
    EffectsModule.forFeature([BaseEffects]),
  ],
  exports: [AboutComponent, HelpComponent, NotFoundComponent, RootComponent, StartPageComponent],
})
export class BasePagesModule {}
