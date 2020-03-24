import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { OverviewComponent } from "./overview/overview.component";
import { DetailComponent } from "./detail/detail.component";
import { EditorComponent } from "./editor/editor.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "overview" },
  { path: "overview", component: OverviewComponent },
  { path: "detail/:id", component: DetailComponent },
  { path: "editor", component: EditorComponent },
  { path: "editor/:id", component: EditorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule {}
