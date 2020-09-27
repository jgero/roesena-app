import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToLocalDateStringPipe } from './to-local-date/to-local-date-string.pipe';
import { ToLocalTimeStringPipe } from './to-local-time/to-local-time-string.pipe';
import { ErrorMessagePipe } from './error-message/error-message.pipe';

const pipes = [ToLocalDateStringPipe, ToLocalTimeStringPipe, ErrorMessagePipe];

@NgModule({
  declarations: pipes,
  imports: [CommonModule],
  exports: pipes,
})
export class ConvertersModule {}
