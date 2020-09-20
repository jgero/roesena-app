import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';
import { AngularFireStorageModule } from '@angular/fire/storage';
import {
  AngularFireAnalyticsModule,
  COLLECTION_ENABLED,
  CONFIG,
  DEBUG_MODE,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';

import { StateModule } from '@state/state.module';
import { AppRoutingModule } from './app-routing.module';
import { RootComponent } from '@pages/base-pages/root/root.component';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { BasePagesModule } from '@pages/base-pages/base-pages.module';
import { CommonModule } from '@angular/common';
import { SearchModule } from '@shared/search/search.module';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    AngularFireStorageModule,
    AngularFireAnalyticsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HammerModule,
    StateModule,
    MatSnackBarModule,
    MatNativeDateModule,
    BasePagesModule,
    SearchModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de' },
    { provide: REGION, useValue: 'europe-west1' },
    {
      provide: SETTINGS,
      useValue: environment.useEmulator
        ? {
            host: 'localhost:8080',
            ssl: false,
          }
        : undefined,
    },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000 } },
    {
      provide: CONFIG,
      useValue: {
        send_page_view: false,
        allow_ad_personalization_signals: false,
        anonymize_ip: true,
      },
    },
    { provide: COLLECTION_ENABLED, useValue: false },
    { provide: DEBUG_MODE, useValue: environment.production ? false : true },
    ScreenTrackingService,
    UserTrackingService,
    CookieService,
  ],
  bootstrap: [RootComponent],
})
export class AppModule {}
