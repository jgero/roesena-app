import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { OverviewComponent } from "./overview/overview.component";
import { DetailComponent } from "./detail/detail.component";
import { EditorComponent } from "./editor/editor.component";

import { LoggedInGuard } from "src/app/guards/logged-in.guard";
import { ArticleByIdResolver } from "src/app/resolvers/article-by-id.resolver";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "overview" },
  { path: "overview", component: OverviewComponent },
  { path: "details/:id", component: DetailComponent, resolve: { appArticle: ArticleByIdResolver } },
  { path: "edit", component: EditorComponent, canActivate: [LoggedInGuard] },
  { path: "edit/:id", component: EditorComponent, canActivate: [LoggedInGuard], resolve: { appArticle: ArticleByIdResolver } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule {}
