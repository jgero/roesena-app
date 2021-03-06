import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorRoutingModule } from './error-routing.module';
import { NotFoundComponent } from './not-found.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [CommonModule, ErrorRoutingModule, MatButtonModule],
})
export class ErrorModule {}
