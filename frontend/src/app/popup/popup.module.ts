import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { InfoPopupComponent } from './info-popup/info-popup.component';

@NgModule({
  declarations: [InfoPopupComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ],
  entryComponents: [
    InfoPopupComponent
  ]
})
export class PopupModule { }
