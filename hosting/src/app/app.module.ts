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

import { StateModule } from '@state/state.module';
import { AppRoutingModule } from './app-routing.module';
import { RootComponent } from '@pages/base-pages/root/root.component';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { BasePagesModule } from '@pages/base-pages/base-pages.module';
import { CommonModule } from '@angular/common';

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
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HammerModule,
    StateModule,
    MatSnackBarModule,
    MatNativeDateModule,
    BasePagesModule,
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
  ],
  bootstrap: [RootComponent],
})
export class AppModule {}
