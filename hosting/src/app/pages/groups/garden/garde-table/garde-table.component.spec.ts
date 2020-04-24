import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GardeTableComponent } from './garde-table.component';

describe('GardeTableComponent', () => {
  let component: GardeTableComponent;
  let fixture: ComponentFixture<GardeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GardeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GardeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
