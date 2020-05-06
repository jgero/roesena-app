import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GardenComponent } from './garden/garden.component';
import { CommonComponent } from './common/common.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'garden' },
  {
    path: 'brandjoggala',
    component: CommonComponent,
    data: { groupName: 'Brandjoggala', externalPageLink: 'http://www.brandjoggala.de' },
  },
  {
    path: 'garden',
    component: GardenComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'maeusegarde' },
      { path: 'maeusegarde', component: CommonComponent, data: { groupName: 'Mäusegarde' } },
      { path: 'minigarde', component: CommonComponent, data: { groupName: 'Minigarde' } },
      { path: 'kindergarde', component: CommonComponent, data: { groupName: 'Kindergarde' } },
      { path: 'jugendgarde', component: CommonComponent, data: { groupName: 'Jugendgarde' } },
      { path: 'prinzengarde', component: CommonComponent, data: { groupName: 'Prinzengarde' } },
      { path: 'erste-garde', component: CommonComponent, data: { groupName: '1. Garde' } },
    ],
  },
  { path: 'maennerballett', component: CommonComponent, data: { groupName: 'Männerballett' } },
  {
    path: 'roehling-stones',
    component: CommonComponent,
    data: { groupName: 'Röhling Stones', externalPageLink: 'http://www.roehling-stones.de' },
  },
  { path: 'sechtafeger', component: CommonComponent, data: { groupName: 'Sechtafeger' } },
  {
    path: 'wildes-heer',
    component: CommonComponent,
    data: { groupName: 'Das Wilde Heer', externalPageLink: 'http://www.daswildeheer.de' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsRoutingModule {}
