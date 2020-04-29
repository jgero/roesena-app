import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { OverviewComponent } from "./overview.component";
import { AuthServiceStub } from "src/app/testing/stubs/auth";
import { ActivatedRouteStub } from "src/app/testing/stubs/activated-route";
import { ArticleDalStub } from "src/app/testing/stubs/article-dal";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatGridListModule } from "@angular/material/grid-list";
import { Component } from "@angular/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";

@Component({ selector: "app-article-card", template: "" })
class ArticleCardMock {}

xdescribe("OverviewComponent", () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  const authStub = new AuthServiceStub();
  authStub.$user.next({ id: "asdf", isConfirmedMember: true, name: "John", groups: ["admins"] });
  const activatedRouteStub = new ActivatedRouteStub();
  const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
  const articleStub = new ArticleDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatGridListModule,
        MatPaginatorModule,
        MatProgressBarModule,
      ],
      declarations: [OverviewComponent, ArticleCardMock],
      providers: [
        { provide: ArticleDalService, useValue: articleStub },
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

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
