import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ImageDalService } from 'src/app/services/DAL/image-dal.service';
import { ArticleDalService } from 'src/app/services/DAL/article-dal.service';
import { CommonComponent } from './common.component';
import {
  ActivatedRouteStub,
  ImageCardStubComponent,
  MarkdownViewerStubComponent,
  ImageDalStub,
  ArticleDalStub,
} from 'src/app/testing';

describe('CommonComponent', () => {
  let component: CommonComponent;
  let fixture: ComponentFixture<CommonComponent>;

  const activatedRouteStub = new ActivatedRouteStub(null, { groupName: 'asdf', externalPageLink: 'teest' });
  const imageStub = new ImageDalStub();
  const articleStub = new ArticleDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterTestingModule],
      declarations: [CommonComponent, ImageCardStubComponent, MarkdownViewerStubComponent],
      providers: [
        { provide: ImageDalService, useValue: imageStub },
        { provide: ArticleDalService, useValue: articleStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
