import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetComponent } from './reset.component';
import { AuthServiceStub, testingRoutes } from 'src/app/testing';
import { ActivatedRouteStub } from 'src/app/testing';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute, convertToParamMap, Params, ParamMap } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { AppPerson } from 'src/app/utils/interfaces';
import { routes } from 'src/app/app-root/app-root-routing.module';

describe('ResetComponent', () => {
  let component: ResetComponent;
  let fixture: ComponentFixture<ResetComponent>;

  const authStub = {
    $user: new BehaviorSubject<AppPerson>(null),
    sendResetPasswordMail: (email: string) => of(null),
    changePasswordWithResetCode: (pw: string, code: string) => of(null),
  };
  const activatedRouteStub = {
    snapshot: {
      queryParamMap: convertToParamMap({ oobCode: 'asdfasdf', mode: 'resetPassword' }),
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatToolbarModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(testingRoutes),
      ],
      declarations: [ResetComponent],
      providers: [
        { provide: AuthService, useValue: authStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on init', () => {
    beforeEach(() => {});

    it('should set code if it exists', () => {
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.code).toBe('asdfasdf');
    });

    it('should navigate to startpage if user is logged in', () => {
      const router = TestBed.inject(Router);
      const spy = spyOn(router, 'navigate');
      component.ngOnInit();
      fixture.detectChanges();
      authStub.$user.next({ id: 'asdf', name: 'asdf', isConfirmedMember: true, groups: [] });
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(['']);
    });
  });

  describe('on submit', () => {
    it('should call service for password reset', () => {
      const spy = spyOn(authStub, 'sendResetPasswordMail').and.returnValue(of(null));
      component.resetForm.get('email').setValue('asdf@test.com');
      component.onResetSubmit();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith('asdf@test.com');
    });

    it('should call service for new password', () => {
      const spy = spyOn(authStub, 'changePasswordWithResetCode').and.returnValue(of(null));
      component.newPasswordForm.get('password').setValue('12341234');
      component.code = 'asdfasdf';
      component.onNewPasswordSubmit();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith('12341234', 'asdfasdf');
    });
  });
});
