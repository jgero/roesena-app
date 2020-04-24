import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BrandjoggalaComponent } from "./brandjoggala/brandjoggala.component";
import { GardenComponent } from "./garden/garden.component";
import { MaennerballettComponent } from "./maennerballett/maennerballett.component";
import { RoehlingStonesComponent } from "./roehling-stones/roehling-stones.component";
import { SechtafegerComponent } from "./sechtafeger/sechtafeger.component";
import { WildesHeerComponent } from "./wildes-heer/wildes-heer.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "garden" },
  { path: "brandjoggala", component: BrandjoggalaComponent },
  { path: "garden", component: GardenComponent },
  { path: "maennerballett", component: MaennerballettComponent },
  { path: "roehling-stones", component: RoehlingStonesComponent },
  { path: "sechtafeger", component: SechtafegerComponent },
  { path: "wildes-heer", component: WildesHeerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsRoutingModule {}
