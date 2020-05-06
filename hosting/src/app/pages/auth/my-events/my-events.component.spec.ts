import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subscription, of } from 'rxjs';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';

import { AuthServiceStub, EventDalStub, testingRoutes } from 'src/app/testing';
import { MyEventsComponent } from './my-events.component';
import { AuthService } from 'src/app/services/auth.service';
import { EventDALService } from 'src/app/services/DAL/event-dal.service';
import { PersonDalService } from 'src/app/services/DAL/person-dal.service';
import { ConvertersModule } from 'src/app/shared/converters/converters.module';

describe('MyEventsComponent', () => {
  let component: MyEventsComponent;
  let fixture: ComponentFixture<MyEventsComponent>;
  let sub: Subscription;

  const authStub = new AuthServiceStub();
  const eventStub = new EventDalStub();
  const personStub = jasmine.createSpyObj('PersonDalService', { respondToEvent: of(true) });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatToolbarModule,
        MatInputModule,
        MatButtonModule,
        MatProgressBarModule,
        MatTableModule,
        ConvertersModule,
        MatBadgeModule,
        MatIconModule,
        RouterTestingModule.withRoutes(testingRoutes),
      ],
      declarations: [MyEventsComponent],
      providers: [
        { provide: AuthService, useValue: authStub },
        { provide: EventDALService, useValue: eventStub },
        { provide: PersonDalService, useValue: personStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEventsComponent);
    component = fixture.componentInstance;
    authStub.$user.next({ id: 'myUID', name: 'JOHN', isConfirmedMember: true, groups: [] });
    eventStub.dataArray = [
      {
        deadline: new Date(),
        ownerId: 'asdf',
        description: 'a',
        endDate: new Date(),
        startDate: new Date(),
        ownerName: 'a',
        tags: [],
        id: 'a',
        title: 'a',
        participants: [{ id: 'myUID', name: 'a', amount: 2 }],
      },
    ];
    fixture.detectChanges();
  });

  afterEach(() => {
    if (sub) { sub.unsubscribe(); }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init the data and form', (done) => {
    component.ngOnInit();
    sub = component.$data.subscribe((next) => {
      expect(next[0].form.get('amount').value).toBe(2);
      done();
    });
  });

  it('should call the dal function on submit', () => {
    component.onSubmit('evId', '4', new FormGroup({}));
    expect(personStub.respondToEvent).toHaveBeenCalledWith('evId', 4);
  });
});
