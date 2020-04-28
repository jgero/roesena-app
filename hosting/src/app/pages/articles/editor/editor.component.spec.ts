import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EditorComponent } from "./editor.component";
import { AuthServiceStub } from "src/app/testing/stubs/auth";
import { ActivatedRouteStub } from "src/app/testing/stubs/activated-route";
import { ArticleDalStub } from "src/app/testing/stubs/article-dal";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

describe("EditorComponent", () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  const authStub = new AuthServiceStub();
  authStub.$user.next({ id: "asdf", isConfirmedMember: true, name: "John", groups: ["admins"] });
  const activatedRouteStub = new ActivatedRouteStub();
  const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
  const articleStub = new ArticleDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditorComponent],
      providers: [
        { provide: ArticleDalService, useValue: articleStub },
        { provide: Router, useValue: routerSpy },
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

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
