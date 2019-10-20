import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { PublicPagesModule } from './public-pages/public-pages.module';
import { MainComponent } from './public-pages/main/main.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    PublicPagesModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [
    MainComponent
  ]
})
export class AppModule { }
