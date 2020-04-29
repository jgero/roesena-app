import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ArticleCardComponent } from "./article-card.component";
import { AuthServiceStub } from "src/app/testing/stubs/auth";
import { AuthService } from "src/app/services/auth.service";
import { ToLocalDateStringPipe } from "../../converters/to-local-date/to-local-date-string.pipe";
import { ConvertersModule } from "../../converters/converters.module";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterTestingModule } from "@angular/router/testing";

xdescribe("ArticleCardComponent", () => {
  let component: ArticleCardComponent;
  let fixture: ComponentFixture<ArticleCardComponent>;

  const authStub = new AuthServiceStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleCardComponent],
      providers: [{ provide: AuthService, useValue: authStub }],
      imports: [ConvertersModule, MatCardModule, MatChipsModule, MatButtonModule, MatIconModule, RouterTestingModule],
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
