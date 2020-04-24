import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoehlingStonesComponent } from './roehling-stones.component';

describe('RoehlingStonesComponent', () => {
  let component: RoehlingStonesComponent;
  let fixture: ComponentFixture<RoehlingStonesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoehlingStonesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoehlingStonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
