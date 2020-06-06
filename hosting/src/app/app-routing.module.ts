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
      { path: '', component: StartPageComponent },
      { path: 'events', loadChildren: () => import('@pages/events/events.module').then((m) => m.EventsModule) },
      { path: 'auth', loadChildren: () => import('@pages/auth/auth.module').then((m) => m.AuthModule) },
      { path: 'articles', loadChildren: () => import('@pages/articles/articles.module').then((m) => m.ArticlesModule) },
      { path: 'images', loadChildren: () => import('@pages/images/images.module').then((m) => m.ImagesModule) },
      { path: 'calendar', loadChildren: () => import('@pages/calendar/calendar.module').then((m) => m.CalendarModule) },
      { path: 'groups', loadChildren: () => import('@pages/groups/groups.module').then((m) => m.GroupsModule) },
      { path: 'search/:type/:searchStrings', component: SearchPageComponent },
      { path: 'about', component: AboutComponent },
      { path: 'help', component: HelpComponent },
      { path: '**', component: NotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
