import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGmailInboxPersonalComponent } from './add-gmail-inbox-personal.component';

describe('AddGmailInboxPersonalComponent', () => {
  let component: AddGmailInboxPersonalComponent;
  let fixture: ComponentFixture<AddGmailInboxPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGmailInboxPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGmailInboxPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
