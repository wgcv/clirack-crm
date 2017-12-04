import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFacebookPagePersonalComponent } from './add-facebook-page-personal.component';

describe('AddFacebookPagePersonalComponent', () => {
  let component: AddFacebookPagePersonalComponent;
  let fixture: ComponentFixture<AddFacebookPagePersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFacebookPagePersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFacebookPagePersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
