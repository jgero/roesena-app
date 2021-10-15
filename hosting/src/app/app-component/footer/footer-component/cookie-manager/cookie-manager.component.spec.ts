import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CookieManagerComponent } from './cookie-manager.component';

describe('CookieManagerComponent', () => {
  let component: CookieManagerComponent;
  let fixture: ComponentFixture<CookieManagerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CookieManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
