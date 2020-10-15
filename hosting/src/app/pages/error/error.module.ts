import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorRoutingModule } from './error-routing.module';
import { NotFoundComponent } from './not-found.component';
import { MatButtonModule } from '@angular/material/button';
import { HeadingsModule } from '@shared/headings/headings.module';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [CommonModule, ErrorRoutingModule, MatButtonModule, HeadingsModule],
})
export class ErrorModule {}
