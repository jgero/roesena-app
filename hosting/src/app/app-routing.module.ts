import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartPageComponent } from '@pages/base-pages/start-page/start-page.component';
import { AboutComponent } from '@pages/base-pages/about/about.component';
import { HelpComponent } from '@pages/base-pages/help/help.component';
import { NotFoundComponent } from '@pages/base-pages/not-found/not-found.component';
import { LoadUserGuard } from '@guards/load-user.guard';
import { SearchPageComponent } from '@shared/search/search-page/search-page.component';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [LoadUserGuard],
    children: [
      { path: '', component: StartPageComponent, data: { animation: 'startpage' } },
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
      { path: 'about', component: AboutComponent, data: { animation: 'about' } },
      { path: 'help', component: HelpComponent, data: { animation: 'help' } },
      { path: 'search/:type/:searchStrings', component: SearchPageComponent, data: { animation: 'search' } },
      { path: '**', component: NotFoundComponent, data: { animation: 'error' } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
