import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggedInGuard } from 'src/app/guards/logged-in.guard';

import { OverviewComponent } from './overview/overview.component';
import { DetailsComponent } from './details/details.component';
import { EditorComponent } from './editor/editor.component';
import { EventResolver } from 'src/app/resolvers/event.resolver';
import { PersonsResolver } from 'src/app/resolvers/persons.resolver';
import { EmptyEventResolver } from 'src/app/resolvers/empty-event.resolver';

const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'overview', component: OverviewComponent },
  { path: 'overview/:searchString', component: OverviewComponent },
  { path: 'details/:id', component: DetailsComponent, resolve: { event: EventResolver } },
  {
    path: 'edit',
    component: EditorComponent,
    canActivate: [LoggedInGuard],
    resolve: { event: EmptyEventResolver, persons: PersonsResolver },
  },
  {
    path: 'edit/:id',
    component: EditorComponent,
    canActivate: [LoggedInGuard],
    resolve: { event: EventResolver, persons: PersonsResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
