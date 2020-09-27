import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';
import { HeadingsModule } from '@shared/headings/headings.module';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [AboutComponent],
  imports: [CommonModule, AboutRoutingModule, HeadingsModule, MatListModule, MatIconModule, MatButtonModule],
})
export class AboutModule {}
