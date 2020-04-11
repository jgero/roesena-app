import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NavigationComponent } from "./navigation/navigation.component";
import { SechtafegerComponent } from "./sechtafeger/sechtafeger.component";
import { WildesHeerComponent } from "./wildes-heer/wildes-heer.component";
import { MaennerballettComponent } from "./maennerballett/maennerballett.component";
import { RoehlingStonesComponent } from "./roehling-stones/roehling-stones.component";
import { BrandjoggalaComponent } from "./brandjoggala/brandjoggala.component";

const routes: Routes = [
  {
    path: "",
    component: NavigationComponent,
    children: [
      { path: "", pathMatch: "full", redirectTo: "sechtafeger" },
      { path: "sechtafeger", component: SechtafegerComponent },
      { path: "wildes-heer", component: WildesHeerComponent },
      { path: "maennerballett", component: MaennerballettComponent },
      { path: "roehling-stones", component: RoehlingStonesComponent },
      { path: "brandjoggala", component: BrandjoggalaComponent },
      {
        path: "garden",
        loadChildren: () => import("./garden/garden.module").then(m => m.GardenModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule {}
