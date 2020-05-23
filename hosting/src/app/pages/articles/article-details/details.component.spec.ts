import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DetailsComponent } from './details.component';
import { ConvertersModule } from 'src/app/shared/converters/converters.module';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRouteStub, MarkdownViewerStubComponent, AuthServiceStub, testingRoutes } from 'src/app/testing';
import { ImageDalService } from 'src/app/services/DAL/image-dal.service';

describe('Articles-DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  const activatedRouteStub = {
    snapshot: {
      data: {
        article: {
          id: '',
          ownerId: '',
          ownerName: '',
          tags: [],
          title: '',
          content: '',
          created: new Date(),
        },
      },
    },
  };
  const imageStub = { getBySearchStrings: (a: any, b: any) => of([]) };
  const authServiceStub = new AuthServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatChipsModule,
        MatProgressBarModule,
        MatButtonModule,
        MatIconModule,
        ConvertersModule,
        RouterTestingModule.withRoutes(testingRoutes),
      ],
      declarations: [DetailsComponent, MarkdownViewerStubComponent],
      providers: [
        { provide: ImageDalService, useValue: imageStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
