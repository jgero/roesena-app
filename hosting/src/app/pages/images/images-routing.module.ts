import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedInGuard } from '@guards/logged-in.guard';

const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'overview', loadChildren: () => import('./image-overview/image-overview.module').then((m) => m.ImageOverviewModule) },
  { path: 'details', loadChildren: () => import('./image-details/image-details.module').then((m) => m.ImageDetailsModule) },
  {
    path: 'edit',
    loadChildren: () => import('./image-editor/image-editor.module').then((m) => m.ImageEditorModule),
    canActivate: [LoggedInGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImagesRoutingModule {}
