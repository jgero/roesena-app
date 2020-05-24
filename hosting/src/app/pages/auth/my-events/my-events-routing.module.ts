import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyEventsComponent } from './my-events.component';
import { LoggedInGuard } from '@guards/logged-in.guard';

const routes: Routes = [{ path: '', component: MyEventsComponent, canActivate: [LoggedInGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyEventsRoutingModule {}
