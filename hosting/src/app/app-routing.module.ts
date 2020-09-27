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
        data: { animation: 'startpage' },
      },
      {
        path: 'events',
        loadChildren: () => import('@pages/events/events.module').then((m) => m.EventsModule),
        data: { animation: 'events' },
      },
      {
        path: 'auth',
        loadChildren: () => import('@pages/auth/auth.module').then((m) => m.AuthModule),
        data: { animation: 'auth' },
      },
      {
        path: 'articles',
        loadChildren: () => import('@pages/articles/articles.module').then((m) => m.ArticlesModule),
        data: { animation: 'articles' },
      },
      {
        path: 'images',
        loadChildren: () => import('@pages/images/images.module').then((m) => m.ImagesModule),
        data: { animation: 'images' },
      },
      {
        path: 'calendar',
        loadChildren: () => import('@pages/calendar/calendar.module').then((m) => m.CalendarModule),
        data: { animation: 'calendar' },
      },
      {
        path: 'groups',
        loadChildren: () => import('@pages/groups/groups.module').then((m) => m.GroupsModule),
        data: { animation: 'groups' },
      },
      {
        path: 'about',
        loadChildren: () => import('@pages/about/about.module').then((m) => m.AboutModule),
        data: { animation: 'about' },
      },
      {
        path: 'data-protection',
        loadChildren: () => import('@pages/data-protection/data-protection.module').then((m) => m.DataProtectionModule),
        data: { animation: 'data-protection' },
      },
      {
        path: 'help',
        loadChildren: () => import('@pages/help/help.module').then((m) => m.HelpModule),
        data: { animation: 'help' },
      },
      {
        path: 'search',
        loadChildren: () => import('@pages/search/search.module').then((m) => m.SearchModule),
        data: { animation: 'search' },
      },
      {
        path: '**',
        loadChildren: () => import('@pages/error/error.module').then((m) => m.ErrorModule),
        data: { animation: 'error' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
