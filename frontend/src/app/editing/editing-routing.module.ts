import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/services/auth.guard';
import { PersonEditingComponent } from './person-editing/person-editing.component';
import { EventEditingComponent } from './event-editing/event-editing.component';
import { ArticleEditingComponent } from './article-editing/article-editing.component';
import { ImageEditingComponent } from './image-editing/image-editing.component';
import { EditingComponent } from './editing.component';

const editingRoutes: Routes = [
  {
    path: '',
    component: EditingComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'persons', component: PersonEditingComponent },
      {
        path: 'events',
        children: [{ path: '', component: EventEditingComponent }, { path: ':id', component: EventEditingComponent }]
      },
      {
        path: 'articles',
        children: [{ path: '', component: ArticleEditingComponent }, { path: ':id', component: ArticleEditingComponent }]
      },
      { path: 'images', component: ImageEditingComponent },
      { path: '**', redirectTo: 'persons', pathMatch: 'full' }
    ]
  }
];

export const EditingRouting = RouterModule.forChild(editingRoutes);
