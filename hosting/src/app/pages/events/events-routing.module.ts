import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { EventByIdResolver } from "src/app/resolvers/event-by-id.resolver";

import { EventsPageComponent } from "./events-page.component";
import { EventDetailsComponent } from "./event-details/event-details.component";
import { EventEditorComponent } from "./event-editor/event-editor.component";

const routes: Routes = [
  { path: "", redirectTo: "overview", pathMatch: "full" },
  { path: "overview", component: EventsPageComponent },
  { path: "details/:id", component: EventDetailsComponent, resolve: { appEvent: EventByIdResolver } },
  { path: "edit", component: EventEditorComponent },
  {
    path: "edit/:id",
    component: EventEditorComponent,
    resolve: { appEvent: EventByIdResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule {}
