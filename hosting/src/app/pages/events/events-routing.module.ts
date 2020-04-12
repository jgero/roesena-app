import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { OverviewComponent } from "./overview/overview.component";
import { DetailsComponent } from "./details/details.component";

const routes: Routes = [
  { path: "", redirectTo: "overview", pathMatch: "full" },
  { path: "overview", component: OverviewComponent },
  { path: "details/:id", component: DetailsComponent },
  // { path: "edit", component: EventEditorComponent, canActivate: [LoggedInGuard] },
  // {
  // path: "edit/:id",
  // component: EventEditorComponent,
  // resolve: { appEvent: EventByIdResolver },
  // canActivate: [LoggedInGuard],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
