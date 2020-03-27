import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JungendgardeComponent } from './jungendgarde.component';

describe('JungendgardeComponent', () => {
  let component: JungendgardeComponent;
  let fixture: ComponentFixture<JungendgardeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JungendgardeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JungendgardeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
