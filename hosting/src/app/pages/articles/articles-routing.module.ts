import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { OverviewComponent } from "./overview/overview.component";
import { DetailsComponent } from "./details/details.component";
import { EditorComponent } from "./editor/editor.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "overview" },
  { path: "overview", component: OverviewComponent },
  { path: "overview/:searchString", component: OverviewComponent },
  { path: "details/:id", component: DetailsComponent },
  { path: "edit", component: EditorComponent },
  { path: "edit/:id", component: EditorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticlesRoutingModule {}
