import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ConvertersModule } from 'src/app/shared/converters/converters.module';
import { RegisterComponent } from './register.component';
import { AuthService } from 'src/app/services/auth.service';
import { testingRoutes } from 'src/app/testing';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;

  const authStub = { register: (a: string, b: string, c: string) => of(null) };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatToolbarModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        RouterTestingModule.withRoutes(testingRoutes),
        ReactiveFormsModule,
        ConvertersModule,
      ],
      declarations: [RegisterComponent],
      providers: [{ provide: AuthService, useValue: authStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service and redirect on submit', () => {
    const serviceSpy = spyOn(authStub, 'register').and.returnValue(of(null));
    const routerSpy = spyOn(router, 'navigate');
    component.registerForm.get('name').setValue('John');
    component.registerForm.get('email').setValue('test@mail.de');
    component.registerForm.get('password').setValue('12341234');
    component.onSubmit();
    fixture.detectChanges();
    expect(serviceSpy).toHaveBeenCalledWith('test@mail.de', '12341234', 'John');
    expect(routerSpy).toHaveBeenCalledWith(['auth', 'profile']);
  });
});
