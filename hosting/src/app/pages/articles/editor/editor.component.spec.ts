import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorComponent } from './editor.component';
import { AuthServiceStub, MarkdownPreviewStubComponent, testingRoutes } from 'src/app/testing';
import { ActivatedRouteStub } from 'src/app/testing';
import { ArticleDalStub } from 'src/app/testing';
import { ArticleDalService } from 'src/app/services/DAL/article-dal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppArticle } from 'src/app/utils/interfaces';
import { ReactiveFormsModule } from '@angular/forms';

describe('Articles-EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  const authStub = new AuthServiceStub();
  authStub.$user.next({ id: 'asdf', isConfirmedMember: true, name: 'John', groups: ['admins'] });
  const activatedRouteStub = {
    snapshot: {
      data: {
        article: {
          id: 'asd',
          title: 'asdf',
          created: new Date(),
          content: '',
          tags: [],
          ownerName: 'asdf',
          ownerId: 'asdf',
        },
      },
    },
  };
  const articleStub = new ArticleDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule.withRoutes(testingRoutes),
        ReactiveFormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatChipsModule,
        MatProgressBarModule,
      ],
      declarations: [EditorComponent, MarkdownPreviewStubComponent],
      providers: [
        { provide: ArticleDalService, useValue: articleStub },
        { provide: AuthService, useValue: authStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
