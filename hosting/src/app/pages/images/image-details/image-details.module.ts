import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageDetailsRoutingModule } from './image-details-routing.module';
import { DetailsComponent } from './details.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [DetailsComponent],
  imports: [
    CommonModule,
    ImageDetailsRoutingModule,
    MatChipsModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class ImageDetailsModule {}
