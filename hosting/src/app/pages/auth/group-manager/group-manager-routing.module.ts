import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupManagerComponent } from './group-manager.component';
import { LoggedInGuard } from '@guards/logged-in.guard';

const routes: Routes = [
  {
    path: '',
    component: GroupManagerComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: ':searchString',
    component: GroupManagerComponent,
    canActivate: [LoggedInGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupManagerRoutingModule {}
