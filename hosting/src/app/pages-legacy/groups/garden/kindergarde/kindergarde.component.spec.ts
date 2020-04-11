import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KindergardeComponent } from './kindergarde.component';

describe('KindergardeComponent', () => {
  let component: KindergardeComponent;
  let fixture: ComponentFixture<KindergardeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KindergardeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KindergardeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
