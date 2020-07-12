import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonTileComponent } from './person-tile.component';

describe('PersonTileComponent', () => {
  let component: PersonTileComponent;
  let fixture: ComponentFixture<PersonTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
