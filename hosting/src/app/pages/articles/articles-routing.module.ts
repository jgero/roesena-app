import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from 'src/app/guards/logged-in.guard';
import { HasArticleEditorLoadedGuard } from '@guards/has-article-editor-loaded.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  {
    path: 'overview',
    loadChildren: () => import('./article-overview/article-overview.module').then((m) => m.ArticleOverviewModule),
  },
  {
    path: 'details',
    loadChildren: () => import('./article-details/article-details.module').then((m) => m.ArticleDetailsModule),
  },
  {
    path: 'edit',
    loadChildren: () => import('./article-editor/article-editor.module').then((m) => m.ArticleEditorModule),
    canActivate: [LoggedInGuard],
    canDeactivate: [HasArticleEditorLoadedGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticlesRoutingModule {}
