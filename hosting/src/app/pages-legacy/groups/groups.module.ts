import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GroupsRoutingModule } from "./groups-routing.module";
import { NavigationComponent } from "./navigation/navigation.component";
import { SechtafegerComponent } from "./sechtafeger/sechtafeger.component";
import { WildesHeerComponent } from "./wildes-heer/wildes-heer.component";
import { MaennerballettComponent } from "./maennerballett/maennerballett.component";
import { RoehlingStonesComponent } from "./roehling-stones/roehling-stones.component";
import { BrandjoggalaComponent } from "./brandjoggala/brandjoggala.component";
import { NavigationUtilsModule } from "src/app/shared/navigation-utils/navigation-utils.module";
import { CardsModule } from "src/app/shared/cards/cards.module";

@NgModule({
  declarations: [
    NavigationComponent,
    SechtafegerComponent,
    WildesHeerComponent,
    MaennerballettComponent,
    RoehlingStonesComponent,
    BrandjoggalaComponent
  ],
  imports: [CommonModule, GroupsRoutingModule, NavigationUtilsModule, CardsModule]
})
export class GroupsModule {}
