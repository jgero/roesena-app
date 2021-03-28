import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageDetailsRoutingModule } from './image-details-routing.module';
import { DetailsComponent } from './details.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConvertersModule } from '@shared/converters/converters.module';

@NgModule({
  declarations: [DetailsComponent],
  imports: [
    CommonModule,
    ImageDetailsRoutingModule,
    ConvertersModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class ImageDetailsModule {}
