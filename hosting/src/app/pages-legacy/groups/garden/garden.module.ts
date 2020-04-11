import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GardenRoutingModule } from "./garden-routing.module";
import { GardenComponent } from "./garden.component";
import { MinigardeComponent } from "./minigarde/minigarde.component";
import { KindergardeComponent } from "./kindergarde/kindergarde.component";
import { JungendgardeComponent } from "./jungendgarde/jungendgarde.component";
import { PrinzengardeComponent } from "./prinzengarde/prinzengarde.component";
import { ErstegardeComponent } from "./erstegarde/erstegarde.component";
import { NavigationUtilsModule } from "src/app/shared/navigation-utils/navigation-utils.module";

@NgModule({
  declarations: [
    GardenComponent,
    MinigardeComponent,
    KindergardeComponent,
    JungendgardeComponent,
    PrinzengardeComponent,
    ErstegardeComponent
  ],
  imports: [CommonModule, GardenRoutingModule, NavigationUtilsModule]
})
export class GardenModule {}
