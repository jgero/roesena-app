import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ArticleCardComponent } from "./article-card.component";
import { AuthServiceStub } from "src/app/testing/stubs/auth";
import { AuthService } from "src/app/services/auth.service";
import { ToLocalDateStringPipe } from "../../converters/to-local-date/to-local-date-string.pipe";
import { ConvertersModule } from "../../converters/converters.module";

describe("ArticleCardComponent", () => {
  let component: ArticleCardComponent;
  let fixture: ComponentFixture<ArticleCardComponent>;

  const authStub = new AuthServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleCardComponent],
      providers: [{ provide: AuthService, useValue: authStub }],
      imports: [ConvertersModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleCardComponent);
    component = fixture.componentInstance;
    component.article = {
      id: "asdf",
      title: "test",
      content: "asdf",
      created: new Date(2020, 5, 10),
      ownerId: "asdfasdfasdf",
      ownerName: "Max Mustermann",
      tags: ["test", "tags", "and", "stuff"],
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
