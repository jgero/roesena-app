import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProfileComponent } from './profile.component';
import { AuthService } from 'src/app/services/auth.service';
import { AppPerson } from 'src/app/utils/interfaces';
import { BrowserService } from 'src/app/services/browser.service';
import { ConvertersModule } from 'src/app/shared/converters/converters.module';
import { testingRoutes } from 'src/app/testing';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  const authStub = {
    logout: () => of(true),
    $user: new BehaviorSubject<AppPerson>(null),
    updateName: (a: AppPerson) => of(null),
  };
  const browserStub = { reload: () => {} };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(testingRoutes),
        MatToolbarModule,
        MatListModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        ConvertersModule,
      ],
      declarations: [ProfileComponent],
      providers: [
        { provide: AuthService, useValue: authStub },
        { provide: BrowserService, useValue: browserStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reload page on logout', () => {
    const spy = spyOn(browserStub, 'reload');
    component.logout();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should call dal on submit', () => {
    authStub.$user.next({ id: 'asdf', groups: [], isConfirmedMember: true, name: 'asdf' });
    component.updateNameForm.get('name').setValue('new Name');
    const spy = spyOn(authStub, 'updateName').and.returnValue(of(null));
    component.onUpdateNameSubmit();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith({ id: 'asdf', groups: [], isConfirmedMember: true, name: 'new Name' });
  });
});
