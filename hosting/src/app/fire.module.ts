import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import {
  AngularFireAnalyticsModule,
  CONFIG,
  COLLECTION_ENABLED,
  DEBUG_MODE,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    AngularFireStorageModule,
    AngularFireAnalyticsModule,
  ],
  providers: [
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
  ],
})
export class FireModule {}
