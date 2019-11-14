import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { InfoPopupComponent } from './info-popup/info-popup.component';
import { InputPopupComponent } from './input-popup/input-popup.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [InfoPopupComponent, InputPopupComponent],
  imports: [CommonModule, BrowserAnimationsModule, SharedModule],
  entryComponents: [InfoPopupComponent, InputPopupComponent]
})
export class PopupModule {}
