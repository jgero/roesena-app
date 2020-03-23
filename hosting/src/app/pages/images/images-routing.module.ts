import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ImageOverviewComponent } from "./image-overview/image-overview.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "overview" },
  { path: "overview", component: ImageOverviewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImagesRoutingModule {}
