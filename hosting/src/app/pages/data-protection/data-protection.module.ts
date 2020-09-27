import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataProtectionRoutingModule } from './data-protection-routing.module';
import { DataProtectionComponent } from './data-protection.component';
import { HeadingsModule } from '@shared/headings/headings.module';

@NgModule({
  declarations: [DataProtectionComponent],
  imports: [CommonModule, DataProtectionRoutingModule, HeadingsModule],
})
export class DataProtectionModule {}
