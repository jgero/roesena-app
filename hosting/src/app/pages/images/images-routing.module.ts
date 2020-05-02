import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { OverviewComponent } from "./overview/overview.component";
import { DetailsComponent } from "./details/details.component";
import { EditorComponent } from "./editor/editor.component";
import { LoggedInGuard } from "src/app/guards/logged-in.guard";
import { ImageResolver } from "src/app/resolvers/image.resolver";
import { EmptyImageResolver } from "src/app/resolvers/empty-image.resolver";
import { UrlResolver } from "src/app/resolvers/url.resolver";

const routes: Routes = [
  { path: "", redirectTo: "overview", pathMatch: "full" },
  { path: "overview", component: OverviewComponent },
  { path: "overview/:searchString", component: OverviewComponent },
  { path: "details/:id", component: DetailsComponent, resolve: { image: ImageResolver, url: UrlResolver } },
  {
    path: "edit",
    component: EditorComponent,
    canActivate: [LoggedInGuard],
    resolve: { image: EmptyImageResolver, url: UrlResolver },
  },
  {
    path: "edit/:id",
    component: EditorComponent,
    canActivate: [LoggedInGuard],
    resolve: { image: ImageResolver, url: UrlResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImagesRoutingModule {}
