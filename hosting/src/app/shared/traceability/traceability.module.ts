import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoadingComponent } from "./loading/loading.component";
import { SnackbarComponent } from "./snackbar/snackbar.component";

const components = [LoadingComponent, SnackbarComponent];

@NgModule({
  declarations: components,
  imports: [CommonModule],
  exports: components
})
export class TraceabilityModule {}
