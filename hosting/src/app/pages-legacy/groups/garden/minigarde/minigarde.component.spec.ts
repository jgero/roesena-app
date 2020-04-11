import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinigardeComponent } from './minigarde.component';

describe('MinigardeComponent', () => {
  let component: MinigardeComponent;
  let fixture: ComponentFixture<MinigardeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinigardeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinigardeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
