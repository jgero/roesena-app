import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GroupsRoutingModule } from "./groups-routing.module";
import { BrandjoggalaComponent } from "./brandjoggala/brandjoggala.component";
import { MaennerballettComponent } from "./maennerballett/maennerballett.component";
import { RoehlingStonesComponent } from "./roehling-stones/roehling-stones.component";
import { SechtafegerComponent } from "./sechtafeger/sechtafeger.component";
import { WildesHeerComponent } from "./wildes-heer/wildes-heer.component";
import { GardenComponent } from "./garden/garden.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatTabsModule } from "@angular/material/tabs";
import { CardsModule } from "src/app/shared/cards/cards.module";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { GardeTableComponent } from "./garden/garde-table/garde-table.component";
import { MatTableModule } from "@angular/material/table";

@NgModule({
  declarations: [
    BrandjoggalaComponent,
    MaennerballettComponent,
    RoehlingStonesComponent,
    SechtafegerComponent,
    WildesHeerComponent,
    GardenComponent,
    GardeTableComponent,
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    MatToolbarModule,
    MatGridListModule,
    CardsModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
})
export class GroupsModule {}
