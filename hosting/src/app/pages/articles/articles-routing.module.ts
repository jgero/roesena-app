import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from 'src/app/guards/logged-in.guard';
import { ArticleEditorModule } from './article-editor/article-editor.module';
import { EditorComponent } from './article-editor/editor.component';
import { ArticleDetailsModule } from './article-details/article-details.module';
import { ArticleOverviewModule } from './article-overview/article-overview.module';
import { OverviewComponent } from './article-overview/overview.component';
import { DetailsComponent } from './article-details/details.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  { path: 'overview', component: OverviewComponent },
  { path: 'overview/:searchString', component: OverviewComponent },
  { path: 'details/:id', component: DetailsComponent },
  { path: 'edit', component: EditorComponent, canActivate: [LoggedInGuard] },
  { path: 'edit/:id', component: EditorComponent, canActivate: [LoggedInGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes), ArticleEditorModule, ArticleDetailsModule, ArticleOverviewModule],
  exports: [RouterModule],
})
export class ArticlesRoutingModule {}
