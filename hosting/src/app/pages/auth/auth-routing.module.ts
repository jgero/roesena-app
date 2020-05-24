import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnauthenticatedGuard } from '@guards/unauthenticated.guard';

// import { MyEventsComponent } from './my-events/my-events.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ResetComponent } from './reset/reset.component';
// import { GroupManagerComponent } from './group-manager/group-manager.component';
import { LoggedInGuard } from '@guards/logged-in.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'my-events',
  },
  {
    path: 'my-events',
    loadChildren: () => import('./my-events/my-events.module').then((m) => m.MyEventsModule),
  },
  {
    path: 'group-manager',
    loadChildren: () => import('./group-manager/group-manager.module').then((m) => m.GroupManagerModule),
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [UnauthenticatedGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UnauthenticatedGuard],
  },
  {
    path: 'reset',
    component: ResetComponent,
    canActivate: [UnauthenticatedGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
