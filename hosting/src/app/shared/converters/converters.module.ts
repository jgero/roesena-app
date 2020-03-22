import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ToLocalDateStringPipe } from "./to-local-date/to-local-date-string.pipe";
import { ToLocalTimeStringPipe } from "./to-local-time/to-local-time-string.pipe";

const pipes = [ToLocalDateStringPipe, ToLocalTimeStringPipe];

@NgModule({
  declarations: pipes,
  imports: [CommonModule],
  exports: pipes
})
export class ConvertersModule {}
