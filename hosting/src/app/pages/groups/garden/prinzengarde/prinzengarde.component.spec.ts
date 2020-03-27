import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinzengardeComponent } from './prinzengarde.component';

describe('PrinzengardeComponent', () => {
  let component: PrinzengardeComponent;
  let fixture: ComponentFixture<PrinzengardeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrinzengardeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrinzengardeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
