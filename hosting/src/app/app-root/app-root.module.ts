import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MarkdownModule } from 'ngx-markdown';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';

import { AppRootRoutingModule } from './app-root-routing.module';
import { RootComponent } from './root/root.component';
import { StartPageComponent } from './start-page/start-page.component';
import { CardsModule } from '../shared/cards/cards.module';
import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HelpComponent } from './help/help.component';
import { MarkdownViewerModule } from '../shared/markdown-viewer/markdown-viewer.module';
import { ArticleOverviewEffects } from '../effects/article-overview.effects';
import { reducers } from '../reducers';
import { AuthEffects } from '../effects/auth.effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { NgrxRouterStoreModule } from '../router/ngrx-router.module';
import { SearchEffects } from '../effects/search.effects';

@NgModule({
  declarations: [RootComponent, StartPageComponent, AboutComponent, NotFoundComponent, HelpComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRootRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    AngularFireStorageModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatProgressBarModule,
    CardsModule,
    MarkdownModule.forRoot(),
    MarkdownViewerModule,
    HammerModule,
    StoreModule.forRoot(reducers),
    NgrxRouterStoreModule,
    EffectsModule.forRoot([ArticleOverviewEffects, AuthEffects, SearchEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de' },
    { provide: REGION, useValue: 'europe-west1' },
  ],
  bootstrap: [RootComponent],
})
export class AppRootModule {}
