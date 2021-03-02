import { Component } from '@angular/core';

@Component({
  selector: 'app-garden',
  templateUrl: './garden.component.html',
  styleUrls: ['./garden.component.scss'],
})
export class GardenComponent {
  public readonly navLinks = [
    { label: 'Mäusegarde', path: 'maeusegarde' },
    { label: 'Minigarde', path: 'minigarde' },
    { label: 'Kindergarde', path: 'kindergarde' },
    { label: 'Jugendgarde', path: 'jugendgarde' },
    { label: 'Prinzengarde', path: 'prinzengarde' },
    { label: '1. Garde', path: 'erste-garde' },
  ];

  constructor() {}
}
