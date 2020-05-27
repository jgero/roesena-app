import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorComponent } from './editor.component';

const routes: Routes = [
  { path: '', component: EditorComponent },
  { path: ':id', component: EditorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventEditorRoutingModule {}
