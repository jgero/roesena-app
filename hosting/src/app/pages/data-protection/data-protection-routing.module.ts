import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataProtectionComponent } from './data-protection.component';

const routes: Routes = [{ path: '', component: DataProtectionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataProtectionRoutingModule {}
