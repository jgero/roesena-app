import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from './page-header/page-header.component';
import { ConvertersModule } from '@shared/converters/converters.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [PageHeaderComponent],
  imports: [CommonModule, ConvertersModule, MatIconModule],
  exports: [PageHeaderComponent],
})
export class HeadingsModule {}
