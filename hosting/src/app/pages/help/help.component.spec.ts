import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HelpComponent } from './help.component';
import { ArticleDalService } from 'src/app/services/DAL/article-dal.service';
import { of } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MarkdownViewerStubComponent } from 'src/app/testing';

describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;

  const articleStub = {
    getBySearchStrings: (a: any, b: any) =>
      of([
        {
          id: '',
          ownerId: '',
          ownerName: '',
          tags: [],
          title: '',
          content: '',
          created: new Date(),
        },
      ]),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatToolbarModule],
      declarations: [HelpComponent, MarkdownViewerStubComponent],
      providers: [{ provide: ArticleDalService, useValue: articleStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
