import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLevelManagerComponent } from './auth-level-manager.component';

describe('AuthLevelManagerComponent', () => {
  let component: AuthLevelManagerComponent;
  let fixture: ComponentFixture<AuthLevelManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthLevelManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthLevelManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
