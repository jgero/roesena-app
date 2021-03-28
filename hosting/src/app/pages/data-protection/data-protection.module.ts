import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataProtectionRoutingModule } from './data-protection-routing.module';
import { DataProtectionComponent } from './data-protection.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [DataProtectionComponent],
  imports: [CommonModule, DataProtectionRoutingModule, MatButtonModule],
})
export class DataProtectionModule {}
