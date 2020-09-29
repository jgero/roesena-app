import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpRoutingModule } from './help-routing.module';
import { HelpComponent } from './help.component';
import { HeadingsModule } from '@shared/headings/headings.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [HelpComponent],
  imports: [CommonModule, HelpRoutingModule, HeadingsModule, MatIconModule],
})
export class HelpModule {}
