import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { NavBarComponent } from "./components/nav-bar/nav-bar.component";

import { ToLocalDateStringPipe } from "./pipes/to-local-date-string.pipe";
import { EventCardComponent } from "./components/event-card/event-card.component";
import { ToLocalTimeStringPipe } from "./pipes/to-local-time-string.pipe";
import { LoadingComponent } from "./components/loading/loading.component";
import { InputComponent } from "./components/input/input.component";
import { DropdownComponent } from "./components/dropdown/dropdown.component";
import { PersonManagerComponent } from "./components/person-manager/person-manager.component";
import { TabBarComponent } from "./components/tab-bar/tab-bar.component";

const components = [
  NavBarComponent,
  EventCardComponent,
  LoadingComponent,
  InputComponent,
  DropdownComponent,
  PersonManagerComponent,
  TabBarComponent
];
const pipes = [ToLocalDateStringPipe, ToLocalTimeStringPipe];

@NgModule({
  declarations: [...components, ...pipes],
  imports: [CommonModule, RouterModule],
  exports: [...components, ...pipes]
})
export class SharedModule {}
