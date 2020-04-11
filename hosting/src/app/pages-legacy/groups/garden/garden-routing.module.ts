import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GardenComponent } from "./garden.component";
import { MinigardeComponent } from "./minigarde/minigarde.component";
import { KindergardeComponent } from "./kindergarde/kindergarde.component";
import { JungendgardeComponent } from "./jungendgarde/jungendgarde.component";
import { PrinzengardeComponent } from "./prinzengarde/prinzengarde.component";
import { ErstegardeComponent } from "./erstegarde/erstegarde.component";

const routes: Routes = [
  {
    path: "",
    component: GardenComponent,
    children: [
      { path: "", pathMatch: "full", redirectTo: "minigarde" },
      { path: "minigarde", component: MinigardeComponent },
      { path: "kindergarde", component: KindergardeComponent },
      { path: "jugendgarde", component: JungendgardeComponent },
      { path: "prinzengarde", component: PrinzengardeComponent },
      { path: "erstegarde", component: ErstegardeComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GardenRoutingModule {}
