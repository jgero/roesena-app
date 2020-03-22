import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { TabBarComponent } from "./tab-bar/tab-bar.component";
import { RouterModule } from "@angular/router";

const components = [NavBarComponent, TabBarComponent];

@NgModule({
  declarations: components,
  imports: [CommonModule, RouterModule],
  exports: components
})
export class NavigationUtilsModule {}
