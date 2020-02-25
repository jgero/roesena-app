import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { NavBarComponent } from "./components/nav-bar/nav-bar.component";

import { ToLocalDateStringPipe } from "./pipes/to-local-date-string.pipe";
import { EventCardComponent } from "./components/event-card/event-card.component";
import { ToLocalTimeStringPipe } from "./pipes/to-local-time-string.pipe";

const components = [NavBarComponent, EventCardComponent];
const pipes = [ToLocalDateStringPipe, ToLocalTimeStringPipe];

@NgModule({
  declarations: [...components, ...pipes],
  imports: [CommonModule, RouterModule],
  exports: [...components, ...pipes]
})
export class SharedModule {}
