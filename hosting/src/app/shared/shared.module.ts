import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { NavBarComponent } from "./components/nav-bar/nav-bar.component";

import { ToLocalDateStringPipe } from "./pipes/to-local-date-string.pipe";
import { EventCardComponent } from "./components/event-card/event-card.component";
import { ToLocalTimeStringPipe } from "./pipes/to-local-time-string.pipe";
import { LoadingComponent } from "./components/loading/loading.component";
import { AuthStatusComponent } from "./components/auth-status/auth-status.component";
import { InputComponent } from "./components/input/input.component";

const components = [NavBarComponent, EventCardComponent, LoadingComponent, AuthStatusComponent, InputComponent];
const pipes = [ToLocalDateStringPipe, ToLocalTimeStringPipe];

@NgModule({
  declarations: [...components, ...pipes],
  imports: [CommonModule, RouterModule],
  exports: [...components, ...pipes]
})
export class SharedModule {}
