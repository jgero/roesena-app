import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { OverviewComponent } from "./overview/overview.component";
import { DetailsComponent } from "./details/details.component";
import { EditorComponent } from "./editor/editor.component";
import { LoggedInGuard } from "src/app/guards/logged-in.guard";
import { ArticleResolver } from "src/app/resolvers/article.resolver";
import { EmptyArticleResolver } from "src/app/resolvers/empty-article.resolver";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "overview" },
  { path: "overview", component: OverviewComponent },
  { path: "overview/:searchString", component: OverviewComponent },
  { path: "details/:id", component: DetailsComponent, resolve: { article: ArticleResolver } },
  { path: "edit", component: EditorComponent, canActivate: [LoggedInGuard], resolve: { article: EmptyArticleResolver } },
  { path: "edit/:id", component: EditorComponent, canActivate: [LoggedInGuard], resolve: { article: ArticleResolver } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticlesRoutingModule {}
