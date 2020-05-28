import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

import { OverviewComponent } from './overview.component';
import {
  AuthServiceStub,
  ImageCardStubComponent,
  ActivatedRouteStub,
  ImageDalStub,
  SearchBarStubComponent,
} from 'src/app/testing';
import { ImageDalService } from 'src/app/services/DAL/image-dal.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatPaginatorModule } from '@angular/material/paginator';

describe('Images-OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  const authStub = new AuthServiceStub();
  const activatedRouteStub = new ActivatedRouteStub();
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const imageStub = new ImageDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FormsModule,
        MatToolbarModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatGridListModule,
        MatPaginatorModule,
      ],
      declarations: [OverviewComponent, ImageCardStubComponent, SearchBarStubComponent],
      providers: [
        { provide: ImageDalService, useValue: imageStub },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
