import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from '@guards/logged-in.guard';

const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'overview', loadChildren: () => import('./event-overview/event-overview.module').then((e) => e.EventOverviewModule) },
  { path: 'details', loadChildren: () => import('./event-details/event-details.module').then((e) => e.EventDetailsModule) },
  {
    path: 'edit',
    canActivate: [LoggedInGuard],
    loadChildren: () => import('./event-editor/event-editor.module').then((e) => e.EventEditorModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
