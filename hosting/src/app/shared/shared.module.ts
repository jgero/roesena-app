import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

import { NavBarComponent } from "./components/nav-bar/nav-bar.component";

import { ToLocalDateStringPipe } from "./pipes/to-local-date-string.pipe";
import { ToLocalTimeStringPipe } from "./pipes/to-local-time-string.pipe";

import { EventCardComponent } from "./components/event-card/event-card.component";
import { LoadingComponent } from "./components/loading/loading.component";
import { InputComponent } from "./components/input/input.component";
import { DropdownComponent } from "./components/dropdown/dropdown.component";
import { PersonManagerComponent } from "./components/person-manager/person-manager.component";
import { TabBarComponent } from "./components/tab-bar/tab-bar.component";
import { SnackbarComponent } from "./components/snackbar/snackbar.component";

const components = [
  NavBarComponent,
  EventCardComponent,
  LoadingComponent,
  InputComponent,
  DropdownComponent,
  PersonManagerComponent,
  TabBarComponent,
  SnackbarComponent
];
const pipes = [ToLocalDateStringPipe, ToLocalTimeStringPipe];

@NgModule({
  declarations: [...components, ...pipes],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [...components, ...pipes]
})
export class SharedModule {}
