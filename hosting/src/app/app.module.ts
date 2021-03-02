import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';

import { StateModule } from '@state/state.module';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { FireModule } from './fire.module';
import { AppComponentModule } from './app-component/app-component.module';
import { AppComponent } from './app-component/app.component';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppComponentModule,
    AppRoutingModule,
    FireModule,
    MaterialModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HammerModule,
    StateModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
