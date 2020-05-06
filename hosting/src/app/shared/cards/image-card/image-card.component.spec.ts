import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ImageDalService } from 'src/app/services/DAL/image-dal.service';
import { ImageCardComponent } from './image-card.component';
import { AuthService } from 'src/app/services/auth.service';
import { AuthServiceStub, ImageDalStub } from 'src/app/testing';

describe('ImageCardComponent', () => {
  let component: ImageCardComponent;
  let fixture: ComponentFixture<ImageCardComponent>;

  const authStub = new AuthServiceStub();
  const imageDalStub = new ImageDalStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, MatChipsModule, MatButtonModule, MatIconModule, RouterTestingModule],
      declarations: [ImageCardComponent],
      providers: [
        { provide: AuthService, useValue: authStub },
        { provide: ImageDalService, useValue: imageDalStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCardComponent);
    component = fixture.componentInstance;
    component.data = {
      id: 'asdf',
      created: new Date(2020, 5, 12),
      ownerId: 'asdfasdf',
      ownerName: 'Max',
      tags: ['asdf', 'test'],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch download url', () => {
    const spy = spyOn(imageDalStub, 'getDownloadURL');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
});
