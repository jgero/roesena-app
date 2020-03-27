import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErstegardeComponent } from './erstegarde.component';

describe('ErstegardeComponent', () => {
  let component: ErstegardeComponent;
  let fixture: ComponentFixture<ErstegardeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErstegardeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErstegardeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
