import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoadUserGuard } from '@guards/load-user.guard';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [LoadUserGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('@pages/start-page/start-page.module').then((m) => m.StartPageModule),
      },
      {
        path: 'events',
        loadChildren: () => import('@pages/events/events.module').then((m) => m.EventsModule),
      },
      {
        path: 'auth',
        loadChildren: () => import('@pages/auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'articles',
        loadChildren: () => import('@pages/articles/articles.module').then((m) => m.ArticlesModule),
      },
      {
        path: 'images',
        loadChildren: () => import('@pages/images/images.module').then((m) => m.ImagesModule),
      },
      {
        path: 'calendar',
        loadChildren: () => import('@pages/calendar/calendar.module').then((m) => m.CalendarModule),
      },
      {
        path: 'groups',
        loadChildren: () => import('@pages/groups/groups.module').then((m) => m.GroupsModule),
      },
      {
        path: 'about',
        loadChildren: () => import('@pages/about/about.module').then((m) => m.AboutModule),
      },
      {
        path: 'data-protection',
        loadChildren: () => import('@pages/data-protection/data-protection.module').then((m) => m.DataProtectionModule),
      },
      {
        path: 'help',
        loadChildren: () => import('@pages/help/help.module').then((m) => m.HelpModule),
      },
      {
        path: 'search',
        loadChildren: () => import('@pages/search/search.module').then((m) => m.SearchModule),
      },
      {
        path: 'error',
        loadChildren: () => import('@pages/error/error.module').then((m) => m.ErrorModule),
      },
      {
        path: 'contact',
        loadChildren: () => import('@pages/contact/contact.module').then((m) => m.ContactModule),
      },
      {
        path: '**',
        redirectTo: 'error',
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', scrollOffset: [0, 150] }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
