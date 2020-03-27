import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SechtafegerComponent } from './sechtafeger.component';

describe('SechtafegerComponent', () => {
  let component: SechtafegerComponent;
  let fixture: ComponentFixture<SechtafegerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SechtafegerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SechtafegerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
