import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoggedInGuard } from "src/app/guards/logged-in.guard";

import { OverviewComponent } from "./overview/overview.component";
import { DetailsComponent } from "./details/details.component";
import { EditorComponent } from "./editor/editor.component";

const routes: Routes = [
  { path: "", redirectTo: "overview", pathMatch: "full" },
  { path: "overview", component: OverviewComponent },
  { path: "details/:id", component: DetailsComponent },
  { path: "edit", component: EditorComponent, canActivate: [LoggedInGuard] },
  { path: "edit/:id", component: EditorComponent, canActivate: [LoggedInGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
