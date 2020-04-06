import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ImageOverviewComponent } from "./image-overview/image-overview.component";
import { ImageEditorComponent } from "./image-editor/image-editor.component";
import { ImageDetailsComponent } from "./image-details/image-details.component";
import { ImageByIdResolver } from "src/app/resolvers/image-by-id.resolver";
import { LoggedInGuard } from "src/app/guards/logged-in.guard";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "overview" },
  { path: "overview", component: ImageOverviewComponent },
  { path: "overview/:searchString", component: ImageOverviewComponent },
  { path: "details/:id", component: ImageDetailsComponent, resolve: { appImage: ImageByIdResolver } },
  { path: "edit", component: ImageEditorComponent, canActivate: [LoggedInGuard] },
  { path: "edit/:id", component: ImageEditorComponent, resolve: { appImage: ImageByIdResolver }, canActivate: [LoggedInGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImagesRoutingModule {}
