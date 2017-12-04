import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFacebookPageTeamComponent } from './add-facebook-page-team.component';

describe('AddFacebookPageTeamComponent', () => {
  let component: AddFacebookPageTeamComponent;
  let fixture: ComponentFixture<AddFacebookPageTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFacebookPageTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFacebookPageTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
