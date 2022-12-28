import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GardenComponent } from './garden/garden.component';
import { CommonComponent } from './common/common.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'garden' },
  {
    path: 'about-us',
    children: [
      {
        path: 'presidency',
        component: CommonComponent,
        data: {
          heading: 'Präsidium der RöSeNa',
          filterTags: ['Präsidium'],
        },
      },
      {
        path: 'schlager',
        component: CommonComponent,
        data: {
          heading: 'Schlager der RöSeNa',
          filterTags: ['Schlager', 'Lied'],
        },
      },
    ],
  },
  {
    path: 'archive',
    children: [
      {
        path: 'royals',
        component: CommonComponent,
        data: {
          heading: 'Prinzenpaare der RöSeNa',
          filterTags: ['Chronik', 'Prinzenpaar'],
        },
      },
      {
        path: 'mini-royals',
        component: CommonComponent,
        data: {
          heading: 'Kinderprinzenpaare der RöSeNa',
          filterTags: ['Chronik', 'Kinderprinzenpaar'],
        },
      },
    ],
  },
  {
    path: 'groups',
    children: [
      {
        path: 'brandjoggala',
        component: CommonComponent,
        data: {
          heading: 'Die Brandjoggala',
          filterTags: ['Gruppenseite', 'Brandjoggala'],
          additionalLink: 'http://www.brandjoggala.de',
        },
      },
      {
        path: 'garden',
        component: GardenComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'maeusegarde' },
          {
            path: 'maeusegarde',
            component: CommonComponent,
            data: { heading: 'Die Mäusegarde', filterTags: ['Mäusegarde', 'Gruppenseite'] },
          },
          {
            path: 'minigarde',
            component: CommonComponent,
            data: { heading: 'Die Minigarde', filterTags: ['Minigarde', 'Gruppenseite'] },
          },
          {
            path: 'kindergarde',
            component: CommonComponent,
            data: { heading: 'Die Kindergarde', filterTags: ['Gruppenseite', 'Kindergarde'] },
          },
          {
            path: 'jugendgarde',
            component: CommonComponent,
            data: { heading: 'Die Jugendgarde', filterTags: ['Jugendgarde', 'Gruppenseite'] },
          },
          {
            path: 'prinzengarde',
            component: CommonComponent,
            data: { heading: 'Die Prinzengarde', filterTags: ['Prinzengarde', 'Gruppenseite'] },
          },
          {
            path: 'erste-garde',
            component: CommonComponent,
            data: { heading: 'Die Erste Garde', filterTags: ['Erste Garde', 'Gruppenseite'] },
          },
        ],
      },
      {
        path: 'maennerballett',
        component: CommonComponent,
        data: { heading: 'Das Männerballett', filterTags: ['Gruppenseite', 'Männerballett'] },
      },
      {
        path: 'liashang-grabsler',
        component: CommonComponent,
        data: {
          heading: 'Die Liashang Grabsler',
          filterTags: ['Gruppenseite', 'Liashang Grabsler']
        },
      },
      {
        path: 'sechtafeger',
        component: CommonComponent,
        data: { heading: 'Die Sechtafeger', filterTags: ['Gruppenseite', 'Sechtafeger'] },
      },
      {
        path: 'wildes-heer',
        component: CommonComponent,
        data: {
          heading: 'Das Wilde Heer',
          filterTags: ['Gruppenseite', 'Das Wilde Heer'],
          additionalLink: 'http://www.daswildeheer.de',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaticArticlesRoutingModule {}
