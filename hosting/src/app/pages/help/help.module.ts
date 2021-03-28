import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpRoutingModule } from './help-routing.module';
import { HelpComponent } from './help.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [HelpComponent],
  imports: [CommonModule, HelpRoutingModule, MatIconModule, MatButtonModule],
})
export class HelpModule {}
